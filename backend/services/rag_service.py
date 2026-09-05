import os
from typing import Dict, Any, List, Optional
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# In-memory stores
_embedding_model: Optional[HuggingFaceEmbeddings] = None
_vector_stores: Dict[str, FAISS] = {}
_transcript_cache: Dict[str, Dict[str, Any]] = {}

def get_embedding_model() -> HuggingFaceEmbeddings:
    global _embedding_model
    if _embedding_model is None:
        # Multilingual MiniLM model supporting 50+ languages (Hindi, Bengali, Spanish, French, English, etc.)
        _embedding_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
    return _embedding_model


def is_video_processed(video_id: str) -> bool:
    return video_id in _vector_stores


def process_video_transcript(video_id: str, transcript_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Chunks transcript text and indexes documents into FAISS vector store.
    """
    transcript_text = transcript_data.get("transcript_text", "")
    if not transcript_text:
        raise ValueError("Transcript content is empty.")

    # 1. Text splitting
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.create_documents(
        texts=[transcript_text],
        metadatas=[{"video_id": video_id}]
    )
    
    # Add chunk index metadata
    for idx, doc in enumerate(chunks):
        doc.metadata["chunk_id"] = idx

    # 2. Build FAISS Vector Store
    embeddings = get_embedding_model()
    vector_store = FAISS.from_documents(chunks, embeddings)

    # 3. Store in memory
    _vector_stores[video_id] = vector_store
    _transcript_cache[video_id] = {
        "chunks_count": len(chunks),
        "transcript_data": transcript_data
    }

    return {
        "video_id": video_id,
        "chunk_count": len(chunks),
        "char_count": transcript_data.get("char_count", len(transcript_text)),
        "word_count": transcript_data.get("word_count", len(transcript_text.split()))
    }


def get_cached_transcript(video_id: str) -> Optional[Dict[str, Any]]:
    return _transcript_cache.get(video_id)


def query_rag(
    video_id: str,
    question: str,
    groq_api_key: Optional[str] = None,
    model_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Retrieves context from vector store and invokes ChatGroq RAG pipeline.
    """
    if video_id not in _vector_stores:
        raise ValueError(f"Video '{video_id}' has not been processed yet. Please submit the video URL first.")

    # Resolve Groq API key
    api_key = groq_api_key or os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("Groq API key is missing. Please provide it in settings or set GROQ_API_KEY in backend .env.")

    # Resolve Model Name (defaults to openai/gpt-oss-20b or env override)
    selected_model = model_name or os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

    # Get retriever (top-6 chunks for cross-lingual recall)
    vector_store = _vector_stores[video_id]
    retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 6})

    # Retrieve matching documents
    retrieved_docs = retriever.invoke(question)
    context_text = "\n\n---\n\n".join(doc.page_content for doc in retrieved_docs)

    # Initialize ChatGroq
    llm = ChatGroq(
        model=selected_model,
        temperature=0.2,
        groq_api_key=api_key
    )

    prompt = PromptTemplate(
        template="""You are an intelligent AI assistant specialized in analyzing YouTube video transcripts.
The transcript context provided below may be in any language or script (such as Hindi, Bengali, Spanish, French, German, English, etc.).

Instructions:
1. Carefully read and comprehend the meaning of the transcript context, regardless of the language or script it is written in.
2. If the user asks their question in English (e.g. "tell me the story in english", "summarize the video", "what happens"), ALWAYS write your full response in clear, fluent English.
3. If the user asks their question in another language (e.g. Hindi, Spanish, French), respond in that language.
4. If asked for a summary, story, or overview, summarize whatever content, narrative, events, dialogue, or topics are present in the transcript context in friendly, clear terms.
5. Do NOT output generic rejection messages like "topic is not discussed" if there is transcript context present. Explain what the transcript contains.

[Transcript Context]:
{context}

Question: {question}

Answer:""",
        input_variables=['context', 'question']
    )

    parser = StrOutputParser()
    chain = prompt | llm | parser

    # Run chain
    answer = chain.invoke({"context": context_text, "question": question})

    sources = [
        {
            "chunk_id": doc.metadata.get("chunk_id", idx),
            "content": doc.page_content
        }
        for idx, doc in enumerate(retrieved_docs)
    ]

    return {
        "video_id": video_id,
        "question": question,
        "answer": answer,
        "sources": sources
    }

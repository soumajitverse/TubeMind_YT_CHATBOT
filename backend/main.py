import os
from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from services.youtube_service import extract_video_id, fetch_transcript
from services.rag_service import (
    process_video_transcript,
    query_rag,
    is_video_processed,
    get_cached_transcript
)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="YouTube Video Chatbot API",
    description="RAG backend using LangChain, HuggingFace embeddings, FAISS, and Groq LLM",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic Schemas
class ProcessVideoRequest(BaseModel):
    video_url_or_id: str = Field(..., example="https://www.youtube.com/watch?v=Gfr50f6ZBvo")

class ChatRequest(BaseModel):
    video_id: str = Field(..., example="Gfr50f6ZBvo")
    question: str = Field(..., example="What is deepmind?")
    groq_api_key: Optional[str] = Field(None, description="Optional custom Groq API key")
    model_name: Optional[str] = Field(None, description="Optional Groq model choice")


@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "YouTube Video Chatbot Backend is running",
        "version": "1.0.0"
    }


@app.get("/api/health")
def health_check():
    has_groq_key = bool(os.getenv("GROQ_API_KEY"))
    return {
        "status": "healthy",
        "has_groq_key": has_groq_key,
        "default_model": os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
    }


@app.post("/api/process_video")
def api_process_video(req: ProcessVideoRequest):
    try:
        video_id = extract_video_id(req.video_url_or_id)
        
        # Check if already processed
        if is_video_processed(video_id):
            cached = get_cached_transcript(video_id)
            return {
                "success": True,
                "message": "Video was already processed and retrieved from cache.",
                "video_id": video_id,
                "chunk_count": cached["chunks_count"],
                "char_count": cached["transcript_data"]["char_count"],
                "word_count": cached["transcript_data"]["word_count"],
                "preview_text": cached["transcript_data"]["transcript_text"][:300] + "..."
            }
        
        # Fetch transcript
        transcript_data = fetch_transcript(video_id)
        
        # Process and store FAISS index
        result = process_video_transcript(video_id, transcript_data)
        
        return {
            "success": True,
            "message": "Transcript successfully processed and vector index built.",
            "video_id": result["video_id"],
            "chunk_count": result["chunk_count"],
            "char_count": result["char_count"],
            "word_count": result["word_count"],
            "preview_text": transcript_data["transcript_text"][:300] + "..."
        }
        
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error processing video: {str(e)}")


@app.post("/api/chat")
def api_chat(req: ChatRequest):
    try:
        res = query_rag(
            video_id=req.video_id,
            question=req.question,
            groq_api_key=req.groq_api_key,
            model_name=req.model_name
        )
        return {
            "success": True,
            "answer": res["answer"],
            "sources": res["sources"]
        }
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"RAG execution error: {str(e)}")


@app.get("/api/transcript/{video_id}")
def api_get_transcript(video_id: str):
    cached = get_cached_transcript(video_id)
    if not cached:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Transcript for video '{video_id}' not found.")
    
    return {
        "success": True,
        "video_id": video_id,
        "transcript_text": cached["transcript_data"]["transcript_text"],
        "chunks": cached["transcript_data"]["chunks"]
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

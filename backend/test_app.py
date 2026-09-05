import sys
import os
from dotenv import load_dotenv

# Set UTF-8 encoding for console output
sys.stdout.reconfigure(encoding='utf-8')

# 1. Load .env
load_dotenv()

print("--- Step 1: Checking .env configuration ---")
api_key = os.getenv("GROQ_API_KEY")
model_name = os.getenv("GROQ_MODEL")
print(f"GROQ_API_KEY loaded: {bool(api_key)} (Prefix: {api_key[:8] if api_key else 'None'})")
print(f"GROQ_MODEL: {model_name}")

if not api_key:
    print("ERROR: GROQ_API_KEY is not loaded!")
    exit(1)

# 2. Test YouTube Service
print("\n--- Step 2: Testing YouTube Transcript Fetching ---")
from services.youtube_service import extract_video_id, fetch_transcript

test_url = "https://youtu.be/B9Qz3ZhiSO8"
video_id = extract_video_id(test_url)
print(f"Extracted Video ID from '{test_url}': {video_id}")

transcript_data = fetch_transcript(video_id)
print(f"Fetched Transcript successfully. Total Words: {transcript_data['word_count']}, Chunks: {len(transcript_data['chunks'])}")

# 3. Test RAG Vector Indexing
print("\n--- Step 3: Testing FAISS Vector Indexing ---")
from services.rag_service import process_video_transcript, query_rag

index_res = process_video_transcript(video_id, transcript_data)
print(f"Vector Store created successfully! Chunks indexed: {index_res['chunk_count']}")

# 4. Test RAG Question Answering with ChatGroq
print("\n--- Step 4: Testing Groq RAG Question Answering ---")
question = "tell me the story in english"
print(f"Question: '{question}'")

rag_res = query_rag(video_id, question)
print("\n[AI Answer]:")
print(rag_res['answer'])
print(f"\nRetrieved Source Chunks ({len(rag_res['sources'])}):")
for idx, src in enumerate(rag_res['sources']):
    print(f"  Chunk #{src['chunk_id'] + 1}: {src['content'][:80]}...")

print("\n--- ✅ ALL TESTS PASSED SUCCESSFULLY! ---")

# 🎥 TubeMind — Interactive AI Assistant for YouTube Transcripts (RAG)

TubeMind is a fullstack **Retrieval-Augmented Generation (RAG)** application built with Python (FastAPI, LangChain, FAISS) and React (Vite, Tailwind CSS v4). It allows users to paste any YouTube video link, automatically extract and vector-index its transcript, and interact with an AI assistant that answers questions based **strictly on the context of the video**.

---

## 🌟 Key Features

- **Instant YouTube Transcript Processing**: Supports standard YouTube URLs, `youtu.be` links, shorts, embeds, and raw 11-character video IDs.
- **Robust Scraper with Fallback**: Uses `youtube-transcript-api` with automatic `yt-dlp` fallback (with mobile/web client spoofing) for reliable transcript retrieval.
- **Multilingual Support**: Uses `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` to support 50+ languages (English, Hindi, Spanish, French, German, Bengali, etc.).
- **RAG System Architecture**:
  - Semantic Chunking via `RecursiveCharacterTextSplitter`.
  - Multilingual Vector Embeddings via `HuggingFaceEmbeddings`.
  - In-Memory Similarity Search with `FAISS` Vector Store.
- **Groq LLM Acceleration**: Fast conversational generation via Groq LLM API.
- **Modern Glassmorphic Dark UI**:
  - Built with **Tailwind CSS v4** and Lucide icons.
  - Embedded YouTube video player & statistics dashboard.
  - Full transcript viewer modal with real-time keyword search and timestamp navigation.
  - Interactive chat panel with markdown rendering and expandable retrieved context source chunks.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide Icons, React Markdown |
| **Backend API** | Python 3.11, FastAPI, Uvicorn, Pydantic |
| **RAG & AI** | LangChain, FAISS (CPU), HuggingFace Multilingual Embeddings, Groq LLM API |
| **Scraping** | `youtube-transcript-api`, `yt-dlp` |

---

## 📁 Repository Structure

```text
YT-chatbot-fullstack/
├── backend/
│   ├── main.py                  # FastAPI server endpoints & CORS middleware
│   ├── requirements.txt         # Python dependencies
│   ├── services/
│   │   ├── youtube_service.py   # Transcript extraction & yt-dlp fallback
│   │   └── rag_service.py       # Chunking, FAISS vector store & RAG chain
│   └── .env.example             # Backend environment template
├── frontend/
│   ├── src/
│   │   ├── components/          # Header, VideoSection, ChatWindow, TranscriptView
│   │   ├── App.jsx              # Main application layout & state
│   │   └── index.css            # Tailwind CSS v4 & custom glassmorphism styles
│   ├── package.json             # Frontend dependencies & scripts
│   ├── vite.config.js           # Vite dev server & Tailwind v4 plugin config
│   └── .env.local               # Frontend API URL environment file
└── README.md                    # Project documentation
```

---

## 🚀 Local Machine Setup Guide

Follow these steps to set up and run the entire application on your local machine.

### Prerequisites

Ensure you have installed:
- **Python 3.10+** ([Download Python](https://www.python.org/downloads/))
- **Node.js 18+ & npm** ([Download Node.js](https://nodejs.org/))
- **Git** ([Download Git](https://git-scm.com/))
- A free **Groq API Key** ([Get your key here](https://console.groq.com/))

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/soumajitverse/TubeMind_YT_CHATBOT.git
cd TubeMind_YT_CHATBOT
```

---

### Step 2: Set Up & Run Backend

1. **Navigate to the `backend` directory**:
   ```bash
   cd backend
   ```

2. **Create a Python Virtual Environment**:
   - **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=8000
   ```

5. **Start the Backend Server**:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   The backend API will run at `http://localhost:8000`. You can view interactive API docs at `http://localhost:8000/docs`.

---

### Step 3: Set Up & Run Frontend

Open a **new terminal window/tab** and stay in the root project directory.

1. **Navigate to the `frontend` directory**:
   ```bash
   cd frontend
   ```

2. **Install Node Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the `frontend/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The frontend application will start at `http://localhost:3000`.

---

### Step 4: Open Application

1. Open your browser and navigate to **`http://localhost:3000`**.
2. Paste a YouTube URL (e.g., `https://www.youtube.com/watch?v=Gfr50f6ZBvo`) and click **Extract & Index**.
3. Once vectorized, ask any question about the video transcript in the interactive chat window!

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint |
| `POST` | `/api/process_video` | Extract transcript, chunk text, build vector store |
| `POST` | `/api/chat` | Query RAG chain with user prompt for a processed video |
| `GET` | `/api/transcript/{video_id}` | Fetch processed transcript details and chunks |

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

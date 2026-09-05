# 🎥 TubeMind — Interactive AI Assistant for YouTube Transcripts (RAG)

TubeMind is a fullstack **Retrieval-Augmented Generation (RAG)** application that allows users to paste any YouTube video link, automatically extract and index its transcript, and interact with an AI assistant that answers questions based **strictly on the context of the video**.

---

## 🌟 Key Features

- **Instant YouTube Transcript Processing**: Supports standard YouTube URLs, `youtu.be` links, shorts, embeds, and raw 11-character video IDs.
- **Robust Scraper with Fallback**: Uses `youtube-transcript-api` with automatic `yt-dlp` fallback to guarantee transcript extraction.
- **Multilingual Support**: Automatically detects transcript language and translates non-English transcripts to English.
- **RAG Architecture**:
  - Semantic Chunking using `RecursiveCharacterTextSplitter`.
  - Dense Vector Embeddings via `HuggingFaceEmbeddings` (`sentence-transformers/all-MiniLM-L6-v2`).
  - Fast Similarity Search with `FAISS` Vector Store.
- **Groq LLM Acceleration**: Ultra-fast LLM inference using Groq models (e.g. `openai/gpt-oss-20b` or custom models).
- **Interactive UI**:
  - Embedded YouTube video player.
  - Interactive transcript view with line search and timestamps.
  - Dynamic chat window with video context-grounded responses.
  - In-app Groq API Key & Model settings configuration modal.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Vanilla CSS (Design System), Lucide Icons |
| **Backend API** | Python 3.11, FastAPI, Uvicorn, Pydantic |
| **RAG & AI** | LangChain, FAISS (CPU), HuggingFace Embeddings, Groq API |
| **Scraping** | `youtube-transcript-api`, `yt-dlp` |

---

## 📁 Repository Structure

```text
YT-chatbot-fullstack/
├── backend/
│   ├── main.py                  # FastAPI server endpoints & CORS setup
│   ├── requirements.txt         # Python dependencies
│   ├── services/
│   │   ├── youtube_service.py   # Transcript extraction & yt-dlp fallback
│   │   └── rag_service.py       # Chunking, FAISS vector store & RAG chain
│   └── .env.example             # Backend environment template
├── frontend/
│   ├── src/                     # React components, styles, & App logic
│   ├── package.json             # Node dependencies & scripts
│   ├── vite.config.js           # Vite server & proxy configuration
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
   The backend API will run at `http://localhost:8000`. You can test API docs at `http://localhost:8000/docs`.

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
2. Click the **Groq Key Settings** button in the top right header to enter your `Groq API Key` (or configure it in `backend/.env`).
3. Paste a YouTube URL (e.g., `https://www.youtube.com/watch?v=Gfr50f6ZBvo`) and click **Extract & Index**.
4. Ask questions in the chat panel!

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

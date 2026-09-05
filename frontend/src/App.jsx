import React, { useState } from 'react';
import Header from './components/Header';
import VideoSection from './components/VideoSection';
import ChatWindow from './components/ChatWindow';
import TranscriptView from './components/TranscriptView';

// Environment API Base URL (empty for local Vite proxy)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  // Video & Transcript state
  const [videoInfo, setVideoInfo] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState(null);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  // Chat stream state
  const [messages, setMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Process Video Handler
  const handleProcessVideo = async (urlOrId) => {
    setIsProcessing(true);
    setProcessError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/process_video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url_or_id: urlOrId })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to process video transcript.');
      }

      setVideoInfo({
        video_id: data.video_id,
        chunk_count: data.chunk_count,
        word_count: data.word_count,
        char_count: data.char_count,
        preview_text: data.preview_text
      });

      // Clear previous chat when new video is loaded
      setMessages([]);
      setTranscriptData(null);
      
    } catch (err) {
      setProcessError(err.message);
      setVideoInfo(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch Full Transcript for Side Viewer
  const handleOpenTranscript = async () => {
    if (!videoInfo) return;
    if (transcriptData) {
      setIsTranscriptOpen(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/transcript/${videoInfo.video_id}`);
      const data = await res.json();
      if (res.ok) {
        setTranscriptData(data);
        setIsTranscriptOpen(true);
      }
    } catch (err) {
      console.error("Failed to load transcript:", err);
    }
  };

  // Send Message Handler
  const handleSendMessage = async (question) => {
    if (!videoInfo) return;

    // Add User message
    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: videoInfo.video_id,
          question: question
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to query video context.');
      }

      // Add AI Assistant Response
      const aiMsg = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources || []
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Error: ${err.message}`,
        sources: []
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Top Navigation */}
      <Header hasVideo={Boolean(videoInfo)} />

      {/* Main Grid Layout */}
      <main className="max-w-7xl w-full my-5 mx-auto px-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Video Input & Embedded Player (5 cols) */}
        <div className="lg:col-span-5">
          <VideoSection 
            onProcessVideo={handleProcessVideo}
            videoInfo={videoInfo}
            isLoading={isProcessing}
            error={processError}
            onOpenTranscript={handleOpenTranscript}
          />
        </div>

        {/* Right Column: Interactive Chat Window (7 cols) */}
        <div className="lg:col-span-7">
          <ChatWindow 
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            hasVideo={Boolean(videoInfo)}
            onClearChat={() => setMessages([])}
          />
        </div>

      </main>

      {/* Full Transcript Viewer Modal */}
      <TranscriptView 
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        transcriptData={transcriptData}
        videoId={videoInfo?.video_id}
      />

    </div>
  );
}

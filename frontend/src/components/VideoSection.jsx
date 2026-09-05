import React, { useState } from 'react';
import { Search, Loader2, PlayCircle, FileText, AlertCircle } from 'lucide-react';

export default function VideoSection({ 
  onProcessVideo, 
  videoInfo, 
  isLoading, 
  error, 
  onOpenTranscript 
}) {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onProcessVideo(inputUrl.trim());
    }
  };

  return (
    <div className="glass-panel p-5 flex flex-col gap-5">
      
      {/* Search Input Bar */}
      <div>
        <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
          <PlayCircle size={20} className="text-indigo-400" />
          Step 1: Input YouTube Video URL
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              className="w-full bg-slate-900/80 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=Gfr50f6ZBvo)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center gap-2 whitespace-nowrap transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={isLoading || !inputUrl.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Extract & Index</span>
            )}
          </button>
        </form>
      </div>

      {/* Error Alert if any */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm">
          <AlertCircle size={20} className="text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Video Player & Info Panel */}
      {videoInfo ? (
        <div className="flex flex-col gap-4">
          
          {/* YouTube Embed Player */}
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl border border-white/10 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoInfo.video_id}?autoplay=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-xl"
            ></iframe>
          </div>

          {/* Stats Bar */}
          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-white/10 flex justify-between items-center flex-wrap gap-2.5">
            <div className="flex gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-gray-400">Video ID: </span>
                <span className="font-semibold text-cyan-400">{videoInfo.video_id}</span>
              </div>
              <div>
                <span className="text-gray-400">Chunks: </span>
                <span className="font-semibold text-white">{videoInfo.chunk_count}</span>
              </div>
              <div>
                <span className="text-gray-400">Words: </span>
                <span className="font-semibold text-white">{videoInfo.word_count?.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={onOpenTranscript}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all"
            >
              <FileText size={15} className="text-indigo-400" />
              <span>Full Transcript</span>
            </button>
          </div>

        </div>
      ) : (
        /* Placeholder view when no video loaded yet */
        <div className="py-10 px-5 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.01] flex flex-col items-center justify-center gap-3">
          <div className="bg-indigo-500/10 p-4 rounded-full text-indigo-400">
            <PlayCircle size={36} />
          </div>
          <div>
            <h3 className="text-base text-white font-semibold">
              No Video Loaded
            </h3>
            <p className="text-xs text-gray-400 max-w-xs mt-1">
              Enter a YouTube link or ID above to automatically extract captions, generate embeddings, and unlock RAG Q&A.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

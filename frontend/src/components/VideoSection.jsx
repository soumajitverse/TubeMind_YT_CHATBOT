import React, { useState } from 'react';
import { Search, Loader2, PlayCircle, FileText, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="glass-panel p-6 flex flex-col gap-6">
      
      {/* Step Header & Search Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <PlayCircle size={18} />
            </div>
            Step 1: Input YouTube Video URL
          </h2>
          {videoInfo && (
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> Indexed
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              className="w-full bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 shadow-inner"
              placeholder="Paste YouTube Link (e.g. https://www.youtube.com/watch?v=...)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="gradient-btn text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={isLoading || !inputUrl.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Extract & Index</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl flex items-start gap-3 text-sm shadow-md">
          <AlertCircle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="leading-snug">{error}</div>
        </div>
      )}

      {/* Video Player & Info Panel */}
      {videoInfo ? (
        <div className="flex flex-col gap-4">
          
          {/* YouTube Embed Player */}
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl border border-slate-700/60 bg-black shadow-[0_0_30px_rgba(99,102,241,0.15)] group">
            <iframe
              src={`https://www.youtube.com/embed/${videoInfo.video_id}?autoplay=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
            ></iframe>
          </div>

          {/* Stats Bar & Transcript Button */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex justify-between items-center flex-wrap gap-3 shadow-inner">
            <div className="flex items-center gap-4 text-xs sm:text-sm flex-wrap">
              <div className="bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
                <span className="text-slate-400 text-xs">ID: </span>
                <span className="font-bold text-cyan-300 font-mono">{videoInfo.video_id}</span>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                <span className="text-slate-400 text-xs">Chunks: </span>
                <span className="font-bold text-purple-300">{videoInfo.chunk_count}</span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                <span className="text-slate-400 text-xs">Words: </span>
                <span className="font-bold text-emerald-300">{videoInfo.word_count?.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={onOpenTranscript}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/40 text-slate-100 font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              <FileText size={15} className="text-purple-400" />
              <span>Full Transcript</span>
            </button>
          </div>

        </div>
      ) : (
        /* Placeholder view when no video loaded yet */
        <div className="py-12 px-6 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/30 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-md"></div>
            <div className="relative bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-full text-indigo-400">
              <PlayCircle size={40} />
            </div>
          </div>
          <div>
            <h3 className="text-base text-white font-bold">
              No Video Loaded
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
              Paste a YouTube link above to extract transcripts, build vector embeddings, and enable instant AI Q&A.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

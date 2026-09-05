import React from 'react';
import { Youtube } from 'lucide-react';

export default function Header({ hasVideo }) {
  return (
    <header className="glass-panel mx-4 mt-4 px-6 py-3.5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <Youtube size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">
                Tube<span className="gradient-text">Mind</span>
              </h1>
              <span className="text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                RAG v1.0
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Interactive AI Assistant for YouTube Transcripts
            </p>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-3.5">
          {/* Active Model / Status Indicator */}
          <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-white/10 text-xs sm:text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-gray-300 font-medium">
              {hasVideo ? 'Video Vectorized' : 'Ready for Video'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}

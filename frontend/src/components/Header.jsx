import React from 'react';
import { Youtube, Sparkles, Activity } from 'lucide-react';

export default function Header({ hasVideo }) {
  return (
    <header className="glass-panel mx-4 mt-4 px-6 py-3.5 border border-white/10">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-red-700 p-2.5 rounded-xl flex items-center justify-center shadow-lg">
              <Youtube size={26} className="text-white drop-shadow-md" />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Tube<span className="gradient-text">Mind</span>
              </h1>
              <span className="text-[11px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
                <Sparkles size={11} className="text-purple-400" />
                RAG v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide mt-0.5">
              Interactive AI Assistant for YouTube Transcripts
            </p>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-3">
          {/* Active Model / Status Indicator */}
          <div className="flex items-center gap-2.5 bg-slate-950/70 px-4 py-2 rounded-full border border-slate-800 text-xs sm:text-sm shadow-inner">
            <span className={`w-2.5 h-2.5 rounded-full ${hasVideo ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]'} animate-pulse`}></span>
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Activity size={14} className={hasVideo ? 'text-emerald-400' : 'text-indigo-400'} />
              {hasVideo ? 'Video Vectorized' : 'Ready for Video'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}

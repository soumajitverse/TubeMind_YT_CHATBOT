import React, { useState } from 'react';
import { X, Search, FileText, Copy, Check } from 'lucide-react';

export default function TranscriptView({ isOpen, onClose, transcriptData, videoId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const text = transcriptData?.transcript_text || '';
  const chunks = transcriptData?.chunks || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredChunks = chunks.filter(c => 
    c.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="glass-panel w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden bg-slate-950/95 border border-slate-800 shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText size={18} />
            </div>
            <h2 className="text-lg font-bold text-white">
              Video Transcript <span className="font-mono text-xs text-cyan-400 ml-2 font-normal bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">({videoId})</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCopy} 
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/40 text-slate-200 font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy All"}</span>
            </button>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              className="w-full bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              placeholder="Search words or phrases in transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Transcript Content Stream */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2.5">
          {filteredChunks.length > 0 ? (
            filteredChunks.map((chunk, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800/60 hover:border-purple-500/30 text-sm transition-all duration-150"
              >
                <span className="text-cyan-400 font-bold font-mono text-xs bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md min-w-[46px] text-center mt-0.5">
                  {formatTime(chunk.start)}
                </span>
                <span className="text-slate-200 flex-1 leading-relaxed">
                  {chunk.text}
                </span>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matches found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

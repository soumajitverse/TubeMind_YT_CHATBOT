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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-5">
      <div className="glass-panel w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden bg-slate-950">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <FileText size={20} className="text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Video Transcript ({videoId})</h2>
          </div>
          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleCopy} 
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy All"}</span>
            </button>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              className="w-full bg-slate-900/80 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
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
                className="flex gap-3.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-sm"
              >
                <span className="text-cyan-400 font-semibold font-mono text-xs min-w-[42px]">
                  {formatTime(chunk.start)}
                </span>
                <span className="text-gray-200 flex-1">
                  {chunk.text}
                </span>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500 text-sm">
              No matches found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

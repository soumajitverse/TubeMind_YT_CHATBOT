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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#0d1322'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Video Transcript ({videoId})</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={handleCopy} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy All"}</span>
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '16px 24px 8px 24px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '42px' }}
              placeholder="Search words or phrases in transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Transcript Content Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredChunks.length > 0 ? (
            filteredChunks.map((chunk, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  fontSize: '0.9rem'
                }}
              >
                <span style={{ 
                  color: 'var(--accent-cyan)', 
                  fontWeight: 600, 
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  minWidth: '42px'
                }}>
                  {formatTime(chunk.start)}
                </span>
                <span style={{ color: 'var(--text-main)', flex: 1 }}>
                  {chunk.text}
                </span>
              </div>
            ))
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matches found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

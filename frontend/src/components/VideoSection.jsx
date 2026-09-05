import React, { useState } from 'react';
import { Search, Loader2, PlayCircle, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

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
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Search Input Bar */}
      <div>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlayCircle size={20} color="var(--primary-light)" />
          Step 1: Input YouTube Video URL
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '42px' }}
              placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=Gfr50f6ZBvo or https://youtu.be/...)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading || !inputUrl.trim()}
            style={{ whiteSpace: 'nowrap' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
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
        <div style={{ 
          background: 'rgba(244, 63, 94, 0.1)', 
          border: '1px solid rgba(244, 63, 94, 0.3)', 
          color: '#fda4af',
          padding: '12px 16px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} color="#f43f5e" />
          <span>{error}</span>
        </div>
      )}

      {/* Video Player & Info Panel */}
      {videoInfo ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* YouTube Embed Player */}
          <div style={{ 
            position: 'relative', 
            paddingBottom: '56.25%', 
            height: 0, 
            overflow: 'hidden', 
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            background: '#000'
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoInfo.video_id}?autoplay=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '12px'
              }}
            ></iframe>
          </div>

          {/* Stats Bar */}
          <div style={{ 
            background: 'rgba(15, 23, 42, 0.5)', 
            padding: '14px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Video ID: </span>
                <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{videoInfo.video_id}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Chunks: </span>
                <span style={{ fontWeight: 600 }}>{videoInfo.chunk_count}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Words: </span>
                <span style={{ fontWeight: 600 }}>{videoInfo.word_count?.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={onOpenTranscript}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
            >
              <FileText size={15} color="var(--primary-light)" />
              <span>Full Transcript</span>
            </button>
          </div>

        </div>
      ) : (
        /* Placeholder view when no video loaded yet */
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          border: '2px dashed var(--border-subtle)', 
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.01)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.1)', 
            padding: '16px', 
            borderRadius: '50%',
            color: 'var(--primary-light)' 
          }}>
            <PlayCircle size={36} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>
              No Video Loaded
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '340px', marginTop: '4px' }}>
              Enter a YouTube link or ID above to automatically extract captions, generate embeddings, and unlock RAG Q&A.
            </p>
          </div>
        </div>
      )}

      {/* CSS Animation Helper */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

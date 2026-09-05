import React from 'react';
import { Youtube } from 'lucide-react';

export default function Header({ hasVideo }) {
  return (
    <header className="glass-panel" style={{ margin: '16px 16px 0 16px', padding: '14px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
            padding: '8px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
          }}>
            <Youtube size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Tube<span className="gradient-text">Mind</span></h1>
              <span style={{ 
                fontSize: '0.7rem', 
                background: 'rgba(99, 102, 241, 0.15)', 
                color: '#818cf8', 
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '2px 8px', 
                borderRadius: '99px',
                fontWeight: 600
              }}>
                RAG v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
              Interactive AI Assistant for YouTube Transcripts
            </p>
          </div>
        </div>

        {/* Right Status Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Active Model / Status Indicator */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.6)', 
            padding: '6px 14px', 
            borderRadius: '99px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem'
          }}>
            <span className="pulsing-dot"></span>
            <span style={{ color: 'var(--text-sub)', fontWeight: 500 }}>
              {hasVideo ? 'Video Vectorized' : 'Ready for Video'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}


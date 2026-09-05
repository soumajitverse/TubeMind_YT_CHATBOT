import React, { useState } from 'react';
import { X, Key, Cpu, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  groqKey, 
  selectedModel, 
  onSave 
}) {
  const [keyInput, setKeyInput] = useState(groqKey || '');
  const [modelInput, setModelInput] = useState(selectedModel || 'openai/gpt-oss-20b');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave(keyInput.trim(), modelInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const modelOptions = [
    { value: 'openai/gpt-oss-20b', label: 'GPT OSS 20B (Default / Recommended)' },
    { value: 'llama-3.3-70b-versatile', label: 'Meta Llama 3.3 70B Versatile' },
    { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B 32k' },
    { value: 'gemma2-9b-it', label: 'Google Gemma 2 9B' }
  ];

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
        maxWidth: '520px',
        background: '#0d1322',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={20} color="var(--primary-light)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Groq API & Model Settings</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Groq API Key Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '6px', fontWeight: 500 }}>
              Groq API Key (gsk_...)
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="gsk_..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              If set in backend <code style={{ color: 'var(--accent-cyan)' }}>.env</code> file, you can leave this blank.
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '6px', fontWeight: 500 }}>
              <Cpu size={15} color="var(--accent-cyan)" />
              Groq LLM Model Architecture
            </label>
            <select
              className="input-field"
              style={{ cursor: 'pointer' }}
              value={modelInput}
              onChange={(e) => setModelInput(e.target.value)}
            >
              {modelOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#111827', color: '#fff' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

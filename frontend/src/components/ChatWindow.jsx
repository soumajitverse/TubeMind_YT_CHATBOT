import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, ChevronDown, ChevronUp, Layers, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatWindow({ 
  messages, 
  onSendMessage, 
  isLoading, 
  hasVideo,
  onClearChat
}) {
  const [inputQuestion, setInputQuestion] = useState('');
  const [expandedSources, setExpandedSources] = useState({});
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "Can you summarize the video?",
    "What are the main key takeaways?",
    "What main topics are discussed?",
    "List the key points step by step"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (inputQuestion.trim() && !isLoading && hasVideo) {
      onSendMessage(inputQuestion.trim());
      setInputQuestion('');
    }
  };

  const handleChipClick = (q) => {
    if (!isLoading && hasVideo) {
      onSendMessage(q);
    }
  };

  const toggleSources = (index) => {
    setExpandedSources(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="glass-panel" style={{ 
      padding: '20px', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '650px',
      justifyContent: 'space-between'
    }}>
      
      {/* Header Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={22} color="var(--primary-light)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Step 2: Interactive Video Chat</h2>
        </div>
        
        {messages.length > 0 && (
          <button 
            onClick={onClearChat}
            className="btn-secondary" 
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            title="Clear Chat History"
          >
            <Trash2 size={14} color="var(--text-muted)" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Message List Stream */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px 4px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px' 
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            color: 'var(--text-sub)',
            gap: '16px'
          }}>
            <div style={{ 
              background: 'rgba(99, 102, 241, 0.1)', 
              padding: '20px', 
              borderRadius: '50%',
              color: 'var(--primary-light)'
            }}>
              <Sparkles size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>
                {hasVideo ? "Ask anything about the video!" : "Load a video to start asking questions"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '380px', marginTop: '6px' }}>
                {hasVideo 
                  ? "The model will answer based strictly on retrieved transcript context chunks." 
                  : "Paste a YouTube link on the left panel first to enable vector search."}
              </p>
            </div>

            {/* Quick Starter Chips */}
            {hasVideo && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '440px', marginTop: '8px' }}>
                {suggestedQuestions.map((q, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleChipClick(q)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', borderRadius: '99px', padding: '6px 14px' }}
                  >
                    <HelpCircle size={14} color="var(--accent-cyan)" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: '6px'
              }}
            >
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                maxWidth: '88%',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
                {/* Avatar */}
                <div style={{ 
                  minWidth: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: msg.role === 'user' ? 'var(--primary-gradient)' : 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} color="var(--accent-cyan)" />}
                </div>

                {/* Message Content Bubble */}
                <div style={{ 
                  background: msg.role === 'user' ? 'var(--bg-user-bubble)' : 'var(--bg-ai-bubble)', 
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  padding: '12px 16px', 
                  borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  color: '#fff',
                  fontSize: '0.92rem',
                  lineHeight: '1.5',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {msg.role === 'user' ? (
                    <div>{msg.content}</div>
                  ) : (
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p style={{ marginBottom: '8px' }} {...props} />,
                        ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', marginBottom: '8px' }} {...props} />,
                        ol: ({node, ...props}) => <ol style={{ paddingLeft: '20px', marginBottom: '8px' }} {...props} />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>

              {/* Expandable Retrieved Context Sources (for AI messages) */}
              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div style={{ marginLeft: '42px', marginTop: '4px', maxWidth: '85%' }}>
                  <button 
                    onClick={() => toggleSources(index)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-sub)', 
                      fontSize: '0.78rem',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    <Layers size={13} color="var(--primary-light)" />
                    <span>{expandedSources[index] ? 'Hide' : 'View'} Context Chunks ({msg.sources.length})</span>
                    {expandedSources[index] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {expandedSources[index] && (
                    <div style={{ 
                      marginTop: '8px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px',
                      background: 'rgba(15, 23, 42, 0.7)',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8rem',
                      color: 'var(--text-sub)'
                    }}>
                      {msg.sources.map((src, sIdx) => (
                        <div key={sIdx} style={{ borderBottom: sIdx < msg.sources.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: '6px' }}>
                          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>[Chunk #{src.chunk_id + 1}]</span>: "{src.content}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-sub)', fontSize: '0.85rem', marginLeft: '42px' }}>
            <div className="pulsing-dot" style={{ width: '10px', height: '10px' }}></div>
            <span>Searching vector store & generating answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
        <input
          type="text"
          className="input-field"
          placeholder={hasVideo ? "Ask a question about the video transcript..." : "Process a video first..."}
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          disabled={!hasVideo || isLoading}
        />
        <button 
          type="submit" 
          className="btn-primary"
          disabled={!hasVideo || isLoading || !inputQuestion.trim()}
          style={{ padding: '12px 18px' }}
        >
          <Send size={18} />
        </button>
      </form>

    </div>
  );
}

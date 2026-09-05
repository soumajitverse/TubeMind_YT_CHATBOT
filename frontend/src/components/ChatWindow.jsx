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
    <div className="glass-panel p-5 flex flex-col h-[650px] justify-between">
      
      {/* Header Bar */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2">
          <Bot size={22} className="text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Step 2: Interactive Video Chat</h2>
        </div>
        
        {messages.length > 0 && (
          <button 
            onClick={onClearChat}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all"
            title="Clear Chat History"
          >
            <Trash2 size={14} className="text-gray-400" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Message List Stream */}
      <div className="flex-1 overflow-y-auto py-4 px-1 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 gap-4">
            <div className="bg-indigo-500/10 p-5 rounded-full text-indigo-400">
              <Sparkles size={32} />
            </div>
            <div>
              <h3 className="text-base text-white font-semibold">
                {hasVideo ? "Ask anything about the video!" : "Load a video to start asking questions"}
              </h3>
              <p className="text-xs text-gray-400 max-w-xs mt-1.5 mx-auto">
                {hasVideo 
                  ? "The model will answer based strictly on retrieved transcript context chunks." 
                  : "Paste a YouTube link on the left panel first to enable vector search."}
              </p>
            </div>

            {/* Quick Starter Chips */}
            {hasVideo && (
              <div className="flex flex-wrap gap-2 justify-center max-w-md mt-2">
                {suggestedQuestions.map((q, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleChipClick(q)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
                  >
                    <HelpCircle size={14} className="text-cyan-400" />
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
              className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 min-w-[32px] rounded-full border border-white/10 flex items-center justify-center text-white shadow-md ${
                  msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-800'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-cyan-400" />}
                </div>

                {/* Message Content Bubble */}
                <div className={`px-4 py-3 text-sm leading-relaxed text-white shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl rounded-tr-none' 
                    : 'bg-slate-800/90 border border-white/10 rounded-2xl rounded-tl-none'
                }`}>
                  {msg.role === 'user' ? (
                    <div>{msg.content}</div>
                  ) : (
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>

              {/* Expandable Context Sources */}
              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div className="ml-10 mt-1 max-w-[85%]">
                  <button 
                    onClick={() => toggleSources(index)}
                    className="text-gray-400 hover:text-white text-xs flex items-center gap-1 px-1.5 py-0.5 rounded transition-all"
                  >
                    <Layers size={13} className="text-indigo-400" />
                    <span>{expandedSources[index] ? 'Hide' : 'View'} Context Chunks ({msg.sources.length})</span>
                    {expandedSources[index] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {expandedSources[index] && (
                    <div className="mt-2 flex flex-col gap-2 bg-slate-900/80 p-3 rounded-xl border border-white/10 text-xs text-gray-300">
                      {msg.sources.map((src, sIdx) => (
                        <div key={sIdx} className="border-b border-white/5 last:border-none pb-1.5 last:pb-0">
                          <span className="text-cyan-400 font-semibold">[Chunk #{src.chunk_id + 1}]</span>: "{src.content}"
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
          <div className="flex items-center gap-2.5 text-gray-400 text-xs ml-10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Searching vector store & generating answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex gap-2.5 border-t border-white/10 pt-3.5">
        <input
          type="text"
          className="w-full bg-slate-900/80 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder={hasVideo ? "Ask a question about the video transcript..." : "Process a video first..."}
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          disabled={!hasVideo || isLoading}
        />
        <button 
          type="submit" 
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 text-white font-semibold px-4.5 py-3 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!hasVideo || isLoading || !inputQuestion.trim()}
        >
          <Send size={18} />
        </button>
      </form>

    </div>
  );
}

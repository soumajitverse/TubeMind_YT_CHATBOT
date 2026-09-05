import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, ChevronDown, ChevronUp, Layers, HelpCircle, MessageSquare } from 'lucide-react';
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
    "Can you summarize the main points?",
    "What are the key takeaways?",
    "List the key steps mentioned in the video",
    "What is the core conclusion?"
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
    <div className="glass-panel p-6 flex flex-col h-[660px] justify-between">
      
      {/* Header Bar */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <MessageSquare size={18} />
          </div>
          <h2 className="text-base font-bold text-white">Step 2: Interactive Video Chat</h2>
        </div>
        
        {messages.length > 0 && (
          <button 
            onClick={onClearChat}
            className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-rose-500/30 text-slate-300 hover:text-rose-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 shadow-sm"
            title="Clear Chat History"
          >
            <Trash2 size={13} />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto py-4 px-1 flex flex-col gap-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-md"></div>
              <div className="relative bg-purple-500/10 border border-purple-500/30 p-4 rounded-full text-purple-400">
                <Sparkles size={32} />
              </div>
            </div>
            <div>
              <h3 className="text-base text-white font-bold">
                {hasVideo ? "Ask anything about the video!" : "Load a video to start asking questions"}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 mx-auto leading-relaxed">
                {hasVideo 
                  ? "Answers are generated based strictly on retrieved video transcript context." 
                  : "Paste a YouTube URL in Step 1 to enable AI vector search."}
              </p>
            </div>

            {/* Quick Starter Chips */}
            {hasVideo && (
              <div className="flex flex-wrap gap-2 justify-center max-w-md mt-2">
                {suggestedQuestions.map((q, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleChipClick(q)}
                    className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                  >
                    <HelpCircle size={13} className="text-cyan-400" />
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
              <div className={`flex gap-3 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 min-w-[32px] rounded-full border flex items-center justify-center text-white shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400/30' 
                    : 'bg-slate-900 border-slate-700 text-cyan-400'
                }`}>
                  {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                </div>

                {/* Message Content Bubble */}
                <div className={`px-4.5 py-3 text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 text-white rounded-2xl rounded-tr-none font-medium' 
                    : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-2xl rounded-tl-none'
                }`}>
                  {msg.role === 'user' ? (
                    <div>{msg.content}</div>
                  ) : (
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1 text-slate-200" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-slate-200" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                        code: ({node, inline, ...props}) => (
                          <code className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs border border-slate-800" {...props} />
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>

              {/* Expandable Context Sources */}
              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div className="ml-11 mt-1 max-w-[85%]">
                  <button 
                    onClick={() => toggleSources(index)}
                    className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-950/60 border border-slate-800 transition-all duration-200"
                  >
                    <Layers size={13} className="text-purple-400" />
                    <span>{expandedSources[index] ? 'Hide' : 'View'} Context Chunks ({msg.sources.length})</span>
                    {expandedSources[index] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {expandedSources[index] && (
                    <div className="mt-2.5 flex flex-col gap-2 bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-inner">
                      {msg.sources.map((src, sIdx) => (
                        <div key={sIdx} className="border-b border-slate-800/80 last:border-none pb-2 last:pb-0">
                          <span className="text-cyan-400 font-mono font-bold">[Chunk #{src.chunk_id + 1}]</span>: <span className="italic text-slate-300">"{src.content}"</span>
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
          <div className="flex items-center gap-2.5 text-slate-400 text-xs ml-11 bg-slate-950/60 border border-slate-800 px-3.5 py-2 rounded-xl w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span>Searching vector store & generating answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex gap-3 border-t border-slate-800 pt-4">
        <input
          type="text"
          className="w-full bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner"
          placeholder={hasVideo ? "Ask a question about the video transcript..." : "Process a video link in Step 1 first..."}
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          disabled={!hasVideo || isLoading}
        />
        <button 
          type="submit" 
          className="gradient-btn text-white font-bold p-3.5 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!hasVideo || isLoading || !inputQuestion.trim()}
        >
          <Send size={18} />
        </button>
      </form>

    </div>
  );
}

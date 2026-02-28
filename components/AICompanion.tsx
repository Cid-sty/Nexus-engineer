
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { getChatResponse } from '../geminiService';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface AICompanionProps { user: UserProfile; }
interface Message { role: 'user' | 'assistant'; content: string; }

const AICompanion: React.FC<AICompanionProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Session Initialized. User: ${user.name.split(' ')[0]} [Tier-3 Node]. Analyzing 25hr commitment trajectory... You are currently 14% ahead of your peers in Gandhinagar. How shall we optimize your architectural blueprint today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    try {
      const response = await getChatResponse([], userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "Protocol Error: Neural link interrupted." }]);
    } catch (err) { console.error(err); }
    finally { setTimeout(() => setIsLoading(false), 500); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto glass rounded-[2.5rem] overflow-hidden shadow-2xl border border-border-primary transition-colors duration-300"
    >
      {/* Chat Header */}
      <div className="p-6 border-b border-border-primary bg-bg-secondary/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 rotate-3 transition-transform hover:rotate-0">
            <Bot size={28} className="text-white fill-white/20" />
          </div>
          <div>
            <h3 className="font-black text-text-primary tracking-tight text-lg">NEXUS INTELLIGENCE</h3>
            <p className="text-[10px] text-accent font-black tracking-widest uppercase">Senior Growth Architect</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">Low Latency</div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      {/* Message Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth blueprint-grid">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-bg-secondary border border-border-primary' : 'bg-accent'}`}>
                  {msg.role === 'user' ? <UserIcon size={20} className="text-text-primary" /> : <Terminal size={20} className="text-white" />}
                </div>
                <div className={`p-6 rounded-[2rem] text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-accent text-white rounded-tr-none font-bold shadow-lg shadow-accent/10' 
                  : 'glass text-text-primary rounded-tl-none font-mono border-border-primary'
                }`}>
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-4 items-center glass px-6 py-4 rounded-3xl border-border-primary">
               <Loader2 className="animate-spin text-accent" size={18} />
               <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Correlating Market Signals...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-bg-secondary/60 border-t border-border-primary">
        <div className="flex gap-3 relative max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query architectural paths, mindset hacks, or squad rebalancing..."
              className="w-full glass border border-border-primary rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/50 transition-all placeholder:text-text-secondary/50 font-medium text-text-primary"
            />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary/30 pointer-events-none" size={18} />
          </div>
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-accent hover:bg-accent/80 disabled:opacity-30 text-white px-8 rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[9px] text-center text-text-secondary mt-4 font-bold uppercase tracking-widest">End-to-End Encrypted Growth Data</p>
      </div>
    </motion.div>
  );
};

export default AICompanion;

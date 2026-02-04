
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { getChatResponse } from '../geminiService';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, Terminal } from 'lucide-react';

interface AICompanionProps { user: UserProfile; }
interface Message { role: 'user' | 'assistant'; content: string; }

const AICompanion: React.FC<AICompanionProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Session Initialized. User: Arjun [Tier-3 Node]. Analyzing 25hr commitment trajectory... You are currently 14% ahead of your peers in Gandhinagar. How shall we optimize your architectural blueprint today?` }
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
    finally { setIsLoading.bind(null, false); setTimeout(() => setIsLoading(false), 500); }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto glass rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/[0.05] animate-in fade-in zoom-in-95 duration-700">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/[0.05] bg-zinc-950/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-0">
            <Bot size={28} className="text-white fill-white/20" />
          </div>
          <div>
            <h3 className="font-black text-white tracking-tight text-lg">NEXUS INTELLIGENCE</h3>
            <p className="text-[10px] text-indigo-400 font-black tracking-widest uppercase">Senior Growth Architect</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">Low Latency</div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      {/* Message Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth blueprint-grid">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
            <div className={`flex gap-5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-indigo-600'}`}>
                {msg.role === 'user' ? <UserIcon size={20} className="text-white" /> : <Terminal size={20} className="text-white" />}
              </div>
              <div className={`p-6 rounded-[2rem] text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none font-bold' 
                : 'glass text-zinc-200 rounded-tl-none font-mono border-white/[0.03]'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4 items-center glass px-6 py-4 rounded-3xl border-white/[0.03]">
               <Loader2 className="animate-spin text-indigo-500" size={18} />
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Correlating Market Signals...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-zinc-950/60 border-t border-white/[0.05]">
        <div className="flex gap-3 relative max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query architectural paths, mindset hacks, or squad rebalancing..."
              className="w-full glass border border-white/[0.05] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 font-medium"
            />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none" size={18} />
          </div>
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white px-8 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[9px] text-center text-zinc-600 mt-4 font-bold uppercase tracking-widest">End-to-End Encrypted Growth Data</p>
      </div>
    </div>
  );
};

export default AICompanion;


import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { getChatResponse } from '../geminiService';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';

interface AICompanionProps {
  user: UserProfile;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AICompanion: React.FC<AICompanionProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello Arjun. I've analyzed your current 25hr/week commitment. You're falling slightly behind on System Design. How can I help you optimize your roadmap today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getChatResponse([], userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "I'm having trouble connecting to the nexus right now." }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col max-w-4xl mx-auto border border-zinc-800 bg-zinc-900/20 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white">Nexus Intelligence</h3>
          <p className="text-xs text-zinc-500">Engineering Growth Specialist</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-zinc-700' : 'bg-indigo-600'}`}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-800/80 text-zinc-200 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center text-zinc-500">
               <Loader2 className="animate-spin" size={16} />
               <span className="text-xs">Analyzing and drafting...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-900/60 border-t border-zinc-800">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about roadmaps, hackathons, or mindset..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-3 rounded-xl transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;

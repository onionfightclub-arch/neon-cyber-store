import React, { useState, useRef, useEffect } from 'react';
import { createSystemChat } from '../services/geminiService';
// Import Chat type from @google/genai to fix the reference error
import { Chat } from '@google/genai';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'CONNECTION_ESTABLISHED. SYSTEM_INTELLIGENCE ONLINE. HOW CAN I ASSIST YOUR OPERATIVE?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      if (!chatRef.current) {
        chatRef.current = createSystemChat();
      }
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'TRANSMISSION_ERROR' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'CRITICAL_UPLINK_FAILURE: RECONNECTING...' }]);
      chatRef.current = null;
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-8 z-[60]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-cyber-black border-2 border-cyber-purple shadow-[0_0_30px_rgba(255,0,255,0.2)] rounded-sm flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 border-b border-cyber-purple bg-cyber-purple/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
              <span className="text-[10px] font-orbitron font-bold text-cyber-purple tracking-widest uppercase">SI_INTERFACE_V4.0</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-cyber-muted hover:text-neon-red">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-sm ${
                  m.role === 'user' 
                    ? 'bg-cyber-gray border border-electric-blue/30 text-electric-blue' 
                    : 'bg-cyber-purple/5 border border-cyber-purple/30 text-cyber-text'
                }`}>
                  <span className="block text-[8px] opacity-50 mb-1 uppercase tracking-tighter">
                    {m.role === 'user' ? 'OPERATIVE' : 'SYSTEM'}
                  </span>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-cyber-purple animate-pulse">DECRYPTING_RESPONSE...</div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border-gray">
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Transmit data..."
                className="flex-1 bg-cyber-gray border border-border-gray rounded-sm px-3 py-2 text-xs text-cyber-text focus:outline-none focus:border-cyber-purple transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="w-10 h-10 bg-cyber-purple text-white flex items-center justify-center rounded-sm hover:neon-glow-purple disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-cyber-black border-2 border-cyber-purple rounded-full flex items-center justify-center text-cyber-purple hover:neon-glow-purple hover:scale-110 transition-all group animate-bounce"
        >
          <div className="absolute inset-0 bg-cyber-purple/10 rounded-full animate-ping"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
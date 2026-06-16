import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Loader2, Lightbulb, Target, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { Message } from '../types';
import { useStore } from '../store';
import { useParams } from 'react-router';

export function Oracle() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: "I am the Oracle. What guidance do you seek on your path as a Weaver?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { progress } = useStore();
  const { realmId } = useParams();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendWithContext = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { role: 'user', parts: [{ text }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setIsOpen(true);

    const context = {
       realm: realmId,
       level: progress.level,
       lastScore: progress.realms[realmId || 'loom']?.highScore || 0
    };

    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], context })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "*The connection to the Oracle faulters...*" }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: "Challenge Me", icon: Target, prompt: "Give me a practice prompt challenge appropriate for my current realm level." },
    { label: "Explain Concept", icon: Lightbulb, prompt: `Explain the core concept of the '${realmId || 'loom'}' realm simply but profoundly.` },
    { label: "Review Last Weave", icon: RefreshCw, prompt: "Based on my progress, what should I focus on improving next?" }
  ];

  return (
    <>
      {/* Floating Button / Toggle */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#12131a] border border-accent-purple/30 text-accent-purple hover:bg-accent-purple hover:text-white shadow-[0_0_20px_rgba(124,108,255,0.2)] hover:shadow-[0_0_30px_rgba(124,108,255,0.6)] transition-all"
        >
          <Sparkles className="w-6 h-6" />
        </motion.button>
      )}

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 p-0 sm:p-4 shadow-2xl"
          >
            <Card className="h-full flex flex-col bg-[#0a0b10]/95 border-l border-[#ffffff10] backdrop-blur-2xl rounded-none sm:rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#12131a]">
                <div className="flex items-center gap-2 text-accent-purple">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-serif text-xl tracking-wide">The Oracle</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-text-muted hover:text-text-primary rounded-md transition-colors bg-white/5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-accent-purple/10 text-text-primary rounded-br-sm border border-accent-purple/20" 
                        : "bg-white/5 text-text-secondary rounded-bl-sm border border-white/5 font-serif"
                    )}>
                      {msg.parts[0].text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex w-full justify-start">
                     <div className="bg-white/5 text-text-muted p-4 rounded-2xl rounded-bl-sm flex items-center gap-3 border border-white/5">
                       <Loader2 className="w-4 h-4 animate-spin text-accent-purple" /> <span className="font-serif italic text-sm">Consulting the loom...</span>
                     </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5 bg-[#12131a]/50">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button 
                      key={idx}
                      onClick={() => sendWithContext(action.prompt)}
                      className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-text-secondary hover:text-accent-purple hover:border-accent-purple/30 transition-all font-mono"
                    >
                      <Icon className="w-3 h-3" /> {action.label}
                    </button>
                  )
                })}
              </div>

              <div className="p-4 border-t border-white/5 bg-[#12131a]">
                <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendWithContext(input)}
                    placeholder="Seek guidance..."
                    className="w-full bg-[#0a0b10] border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-sm outline-none focus:border-accent-purple/50 transition-colors text-text-primary placeholder:text-text-muted shadow-inner"
                  />
                  <button 
                    onClick={() => sendWithContext(input)}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent-purple/10 text-accent-purple rounded-lg hover:bg-accent-purple hover:text-white disabled:opacity-50 disabled:hover:bg-accent-purple/10 disabled:hover:text-accent-purple transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

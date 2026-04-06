import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const QUICK_QUESTIONS = [
  'How do I rehome my pet?',
  'What happens after I apply to adopt?',
  'How does the chat work?',
  'Is adoption free?',
  'How to donate?',
];

const SYSTEM_CONTEXT = `You are PawBot, a friendly assistant for PawHome — a pet rehoming and adoption platform. 
Answer questions clearly and helpfully about:
- How to list/rehome a pet (click "Rehome" tab, fill the form with pet details, photos, and contact info)
- How to adopt (browse pets, view details, click "Apply to Adopt", fill the application, wait for approval, chat with owner)
- Chat feature (real-time messaging between donors and adopters via the Messages tab)
- Wishlist (save pets you like by clicking the heart icon)
- Donation (go to Donate page, choose ₹100/500/1000/5000 or custom amount, pay via UPI/Card/Netbanking/Wallet)
- Emergency rehoming (toggle "Emergency" when listing so the pet gets priority visibility)
- Success stories (real stories of pets who found homes)
- Partner shelters (verified NGOs across India)
- Donation impact: ₹100 = feeds pet 3 days, ₹500 = vet checkup, ₹1000 = shelter 1 month, ₹5000 = full rescue & rehab
Keep responses short, warm, and encouraging. Use emojis occasionally. Do not answer unrelated questions.`;

export default function PawBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi there! 🐾 I'm **PawBot**, your PawHome assistant! I can help you with adopting, rehoming, donations, and more. What can I help you with today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = [...messages, userMsg]
      .map(m => `${m.role === 'user' ? 'User' : 'PawBot'}: ${m.content}`)
      .join('\n');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_CONTEXT}\n\nConversation so far:\n${history}\n\nPawBot:`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-24 md:bottom-6 right-5 z-50 w-14 h-14 rounded-full bg-primary shadow-2xl flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-6 h-6" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle className="w-6 h-6" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-44 md:bottom-24 right-5 z-50 w-[340px] md:w-[380px]"
          >
            <Card className="shadow-2xl border-border/50 overflow-hidden flex flex-col h-[480px]">
              {/* Header */}
              <div className="bg-primary px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-heading font-bold text-white text-sm">PawBot</p>
                  <p className="text-white/70 text-xs">Your PawHome assistant</p>
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/30">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border border-border/50 rounded-bl-sm'}`}>
                      {msg.role === 'assistant'
                        ? <ReactMarkdown className="prose prose-sm max-w-none [&>p]:m-0 [&>ul]:m-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{msg.content}</ReactMarkdown>
                        : msg.content
                      }
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-card border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick suggestions */}
              {messages.length <= 1 && (
                <div className="px-3 py-2 border-t border-border/50 bg-card">
                  <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_QUESTIONS.map(q => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full px-2.5 py-1 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-border/50 flex gap-2 bg-card">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask PawBot anything..."
                  className="rounded-full text-sm flex-1"
                  disabled={loading}
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!input.trim() || loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
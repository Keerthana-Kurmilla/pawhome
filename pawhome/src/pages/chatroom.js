import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Image as ImageIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const urlParams = new URLSearchParams(window.location.search);
  const petId = urlParams.get('pet');
  const ownerEmail = urlParams.get('owner');

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat', roomId],
    queryFn: () => base44.entities.ChatMessage.filter({ chat_room_id: roomId }, 'created_date'),
    refetchInterval: 3000,
  });

  const { data: pet } = useQuery({
    queryKey: ['chat-pet', petId],
    queryFn: async () => {
      if (!petId) return null;
      const pets = await base44.entities.Pet.filter({ id: petId });
      return pets[0];
    },
    enabled: !!petId,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (content) => {
      return base44.entities.ChatMessage.create({
        content,
        chat_room_id: roomId,
        sender_email: user.email,
        receiver_email: ownerEmail || '',
        pet_id: petId || '',
        is_read: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', roomId] });
      setMessage('');
    },
  });

  const sendImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.ChatMessage.create({
      content: '',
      image_url: file_url,
      chat_room_id: roomId,
      sender_email: user.email,
      receiver_email: ownerEmail || '',
      pet_id: petId || '',
      is_read: false,
    });
    queryClient.invalidateQueries({ queryKey: ['chat', roomId] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage.mutate(message.trim());
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-card flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {pet && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
              {pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🐾'}
            </div>
            <div>
              <p className="font-heading font-bold text-sm">{pet.name}</p>
              <p className="text-xs text-muted-foreground">{ownerEmail}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-2/3" />)}</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_email === user?.email;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}>
                  {msg.image_url && (
                    <img src={msg.image_url} alt="" className="rounded-xl mb-2 max-w-full max-h-48 object-cover" />
                  )}
                  {msg.content && <p className="text-sm">{msg.content}</p>}
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                    {msg.created_date ? format(new Date(msg.created_date), 'HH:mm') : ''}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t bg-card flex gap-2">
        <label className="cursor-pointer">
          <Button type="button" variant="ghost" size="icon" asChild>
            <div><ImageIcon className="w-5 h-5 text-muted-foreground" /></div>
          </Button>
          <input type="file" accept="image/*" className="hidden" onChange={sendImage} />
        </label>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full"
        />
        <Button type="submit" size="icon" className="rounded-full" disabled={!message.trim() || sendMessage.isPending}>
          {sendMessage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  );
}
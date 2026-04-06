import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, PawPrint } from 'lucide-react';
import { format } from 'date-fns';

export default function Chats() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['all-chats'],
    queryFn: () => base44.entities.ChatMessage.list('-created_date', 200),
    enabled: !!user,
  });

  // Group by chat_room_id
  const chatRooms = useMemo(() => {
    const rooms = {};
    messages.forEach(msg => {
      if (!rooms[msg.chat_room_id]) {
        rooms[msg.chat_room_id] = { lastMessage: msg, unread: 0, pet_id: msg.pet_id };
      }
      if (!msg.is_read && msg.receiver_email === user?.email) {
        rooms[msg.chat_room_id].unread++;
      }
    });
    return Object.entries(rooms).sort((a, b) => new Date(b[1].lastMessage.created_date) - new Date(a[1].lastMessage.created_date));
  }, [messages, user]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-heading text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-2">Your conversations</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : chatRooms.length === 0 ? (
        <div className="text-center py-20">
          <PawPrint className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg text-muted-foreground">No conversations yet</p>
          <p className="text-sm text-muted-foreground mt-1">Start a chat from a pet's page</p>
        </div>
      ) : (
        <div className="space-y-3">
          {chatRooms.map(([roomId, room]) => {
            const otherPerson = room.lastMessage.sender_email === user?.email
              ? room.lastMessage.receiver_email
              : room.lastMessage.sender_email;
            return (
              <Link key={roomId} to={`/chat/${roomId}?pet=${room.pet_id}&owner=${otherPerson}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl shrink-0">
                      💬
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-heading font-bold text-sm truncate">{otherPerson}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {room.lastMessage.created_date ? format(new Date(room.lastMessage.created_date), 'MMM d') : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-muted-foreground truncate">
                          {room.lastMessage.image_url ? '📷 Photo' : room.lastMessage.content}
                        </p>
                        {room.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs shrink-0">
                            {room.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
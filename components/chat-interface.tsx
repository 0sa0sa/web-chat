"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { MessageWithUser } from "@/lib/types/chat";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { formatMessageTime } from "@/lib/utils/format-time";

interface ChatInterfaceProps {
  user: User;
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const { toast } = useToast();

  // メッセージ履歴を取得
  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "エラー",
        description: "メッセージの取得に失敗しました。",
        variant: "destructive",
      });
      return;
    }

    // ユーザー情報をクライアントサイドで追加
    const messagesWithUser: MessageWithUser[] = data?.map(message => ({
      ...message,
      user: { email: message.user_id === user.id ? user.email || '' : "他のユーザー" }
    })) || [];

    setMessages(messagesWithUser);
  }, [user.id, user.email]);

  // メッセージ送信
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    const { error } = await supabase.from("messages").insert({
      content: newMessage.trim(),
      user_id: user.id,
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "エラー",
        description: "メッセージの送信に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
    }
    setLoading(false);
  };

  // スクロールを最下部に移動
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  // 初期データの取得
  useEffect(() => {
    fetchMessages();
  }, []); // fetchMessages is stable

  // Realtime購読の設定
  useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as MessageWithUser;
            const messageWithUser: MessageWithUser = {
              ...newMessage,
              user: { email: newMessage.user_id === user.id ? user.email || '' : "他のユーザー" }
            };
            setMessages((prev) => [...prev, messageWithUser]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user.id, user.email]); // Include user dependencies

  // 新しいメッセージが追加されたときにスクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserInitials = useCallback((email: string) => {
    return email.substring(0, 2).toUpperCase();
  }, []);


  return (
    <div className="flex flex-col h-full">
      {/* メッセージエリア */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        <div className="space-y-6 py-4">
          {messages.map((message, index) => {
            const isCurrentUser = message.user_id === user.id;
            const showAvatar = index === 0 || 
              messages[index - 1]?.user_id !== message.user_id;
            
            return (
              <div
                key={message.id}
                className={`flex items-end space-x-3 mb-4 ${
                  isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                } ${showAvatar ? "mt-6" : "mt-2"}`}
              >
                {showAvatar ? (
                  <Avatar className="w-8 h-8 mb-2">
                    <AvatarFallback className="text-xs">
                      {getUserInitials(message.user?.email || "?")}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-8 h-8 mb-2" />
                )}
                <div
                  className={`flex flex-col space-y-2 ${
                    isCurrentUser ? "items-end" : "items-start"
                  }`}
                >
                  <Card
                    className={`p-4 max-w-[320px] sm:max-w-lg shadow-sm transition-all hover:shadow-md ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                  </Card>
                  {showAvatar && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground px-2">
                      <span>{message.user?.email}</span>
                      <span>•</span>
                      <span>{formatMessageTime(message.created_at || '')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* メッセージ入力エリア */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 mt-4">
        <form onSubmit={sendMessage} className="flex space-x-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            disabled={loading}
            className="flex-1 min-h-[48px] rounded-full px-6 py-3 focus:ring-2 focus:ring-primary text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e as any);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={loading || !newMessage.trim()}
            className="rounded-full w-12 h-12 p-0 hover:scale-105 transition-transform"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
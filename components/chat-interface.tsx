"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Message } from "@/lib/types/chat";
import type { User } from "@supabase/supabase-js";

interface ChatInterfaceProps {
  user: User;
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // メッセージ履歴を取得
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    // ユーザー情報をクライアントサイドで追加
    const messagesWithUser = data?.map(message => ({
      ...message,
      user: { email: message.user_id === user.id ? user.email : "他のユーザー" }
    })) || [];

    setMessages(messagesWithUser);
  };

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
  }, []);

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
            const newMessage = payload.new as Message;
            const messageWithUser = {
              ...newMessage,
              user: { email: newMessage.user_id === user.id ? user.email : "他のユーザー" }
            };
            setMessages((prev) => [...prev, messageWithUser]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // 新しいメッセージが追加されたときにスクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* メッセージエリア */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.user_id === user.id ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">
                  {getUserInitials(message.user?.email || "?")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col space-y-1 max-w-xs lg:max-w-md ${
                  message.user_id === user.id ? "items-end" : "items-start"
                }`}
              >
                <Card
                  className={`p-3 ${
                    message.user_id === user.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </Card>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{message.user?.email}</span>
                  <span>•</span>
                  <span>{formatTime(message.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* メッセージ入力エリア */}
      <div className="border-t p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
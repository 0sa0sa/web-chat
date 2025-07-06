"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Home } from "lucide-react";
import { Message } from "@/lib/types/chat";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

interface DirectMessageInterfaceProps {
  user: User;
  conversationId: string;
  otherUserId: string;
}

export default function DirectMessageInterface({
  user,
  conversationId,
  otherUserId,
}: DirectMessageInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otherUser, setOtherUser] = useState<{ email: string; display_name?: string } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // 相手ユーザー情報を取得
  const fetchOtherUser = async () => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("email, display_name")
      .eq("id", otherUserId)
      .single();

    if (error) {
      console.error("Error fetching other user:", error);
    } else {
      setOtherUser(data);
    }
  };

  // メッセージ履歴を取得
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    // ユーザー情報をクライアントサイドで追加
    const messagesWithUser = data?.map(message => ({
      ...message,
      user: { 
        email: message.user_id === user.id 
          ? user.email 
          : otherUser?.email || "他のユーザー" 
      }
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
      conversation_id: conversationId,
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
    fetchOtherUser();
  }, [otherUserId]);

  useEffect(() => {
    if (otherUser) {
      fetchMessages();
    }
  }, [otherUser, conversationId]);

  // Realtime購読の設定
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as Message;
            const messageWithUser = {
              ...newMessage,
              user: { 
                email: newMessage.user_id === user.id 
                  ? user.email 
                  : otherUser?.email || "他のユーザー" 
              }
            };
            setMessages((prev) => [...prev, messageWithUser]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, conversationId, user, otherUser]);

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

  if (!otherUser) {
    return <div className="flex items-center justify-center h-full">読み込み中...</div>;
  }

  return (
    <>
      {/* ヘッダー */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container max-w-4xl mx-auto px-4 flex h-14 items-center">
          <div className="mr-4 flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {getUserInitials(otherUser.email)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-semibold">
              {otherUser.display_name || otherUser.email.split('@')[0]}
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <span className="text-sm text-muted-foreground">
              {otherUser.email}
            </span>
          </div>
        </div>
      </header>

      {/* メッセージエリア */}
      <div className="flex-1 flex flex-col">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  まだメッセージがありません。
                  <br />
                  最初のメッセージを送信してみましょう！
                </div>
              ) : (
                messages.map((message) => (
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
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollArea>

        {/* メッセージ入力エリア */}
        <div className="border-t p-4">
          <div className="max-w-4xl mx-auto px-4">
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
      </div>
    </>
  );
}
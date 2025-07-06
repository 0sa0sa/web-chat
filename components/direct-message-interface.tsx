"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Home } from "lucide-react";
import { MessageWithUser, UserProfile } from "@/lib/types/chat";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import UserStatus from "@/components/user-status";
import { usePresence } from "@/hooks/use-presence";
import { formatMessageTime } from "@/lib/utils/format-time";

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
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const { toast } = useToast();
  
  // プレゼンス機能を使用
  usePresence(user);

  // 相手ユーザー情報を取得
  const fetchOtherUser = useCallback(async () => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", otherUserId)
      .single();

    if (error) {
      console.error("Error fetching other user:", error);
      toast({
        title: "エラー",
        description: "ユーザー情報の取得に失敗しました。",
        variant: "destructive",
      });
    } else if (data) {
      setOtherUser(data);
    }
  }, [otherUserId]);

  // メッセージ履歴を取得
  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
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
      user: { 
        email: message.user_id === user.id 
          ? user.email || ''
          : otherUser?.email || "他のユーザー",
        display_name: message.user_id === user.id
          ? user.user_metadata?.display_name
          : otherUser?.display_name
      }
    })) || [];

    setMessages(messagesWithUser);
  }, [conversationId, user.id, user.email, otherUser]);

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
      toast({
        title: "エラー",
        description: "メッセージの送信に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
      toast({
        title: "送信完了",
        description: "メッセージを送信しました。",
      });
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
  }, [otherUserId]); // fetchOtherUser is stable

  useEffect(() => {
    if (otherUser) {
      fetchMessages();
    }
  }, [otherUser, conversationId]); // fetchMessages is stable

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
            const newMessage = payload.new as MessageWithUser;
            const messageWithUser: MessageWithUser = {
              ...newMessage,
              user: { 
                email: newMessage.user_id === user.id 
                  ? user.email || ''
                  : otherUser?.email || "他のユーザー",
                display_name: newMessage.user_id === user.id
                  ? user.user_metadata?.display_name
                  : otherUser?.display_name
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

  const getUserInitials = useCallback((email: string) => {
    return email.substring(0, 2).toUpperCase();
  }, []);


  if (!otherUser) {
    return <div className="flex items-center justify-center h-full">読み込み中...</div>;
  }

  return (
    <>
      {/* ヘッダー */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 mb-2">
        <div className="container max-w-4xl mx-auto px-6 flex h-16 items-center">
          <div className="mr-6 flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="p-2">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="relative ml-2">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="text-sm">
                  {getUserInitials(otherUser.email || 'UN')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <UserStatus userId={otherUserId} size="sm" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold">
                {otherUser.display_name || otherUser.email?.split('@')[0] || 'Unknown User'}
              </h1>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-3">
            <span className="text-sm text-muted-foreground">
              {otherUser.email || 'No email'}
            </span>
          </div>
        </div>
      </header>

      {/* メッセージエリア */}
      <div className="flex-1 flex flex-col">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-4 py-4">
              {messages.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="bg-muted/50 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Send className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-base">
                    まだメッセージがありません。
                    <br />
                    最初のメッセージを送信してみましょう！
                  </p>
                </div>
              ) : (
                messages.map((message, index) => {
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
                          <span className="text-xs text-muted-foreground px-2 mb-1">
                            {formatMessageTime(message.created_at || '')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </ScrollArea>

        {/* メッセージ入力エリア */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 mt-4">
          <div className="max-w-4xl mx-auto px-6">
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
      </div>
    </>
  );
}
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Plus, Search } from "lucide-react";
import { ConversationWithParticipants } from "@/lib/types/chat";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { createUserProfile } from "@/lib/utils/create-user-profile";
import { useToast } from "@/components/ui/use-toast";
import UserStatus from "@/components/user-status";
import { usePresence } from "@/hooks/use-presence";
import { formatConversationTime } from "@/lib/utils/format-time";

interface ConversationsListProps {
  user: User;
}

interface UserSearchResult {
  id: string;
  email: string;
  display_name?: string | null;
}

export default function ConversationsList({ user }: ConversationsListProps) {
  const [conversations, setConversations] = useState<ConversationWithParticipants[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();
  
  // プレゼンス機能を使用
  usePresence(user);

  // 会話一覧を取得
  const fetchConversations = useCallback(async () => {
    // まず会話一覧を取得
    const { data: conversationsData, error: conversationsError } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (conversationsError) {
      console.error("Error fetching conversations:", conversationsError);
      toast({
        title: "エラー",
        description: "会話一覧の取得に失敗しました。",
        variant: "destructive",
      });
      return;
    }

    if (!conversationsData || conversationsData.length === 0) {
      setConversations([]);
      return;
    }

    // 参加者のIDを収集
    const participantIds = new Set<string>();
    conversationsData.forEach(conv => {
      participantIds.add(conv.participant1_id);
      participantIds.add(conv.participant2_id);
    });

    // ユーザープロファイルを一括取得
    const { data: profilesData, error: profilesError } = await supabase
      .from("user_profiles")
      .select("id, email, display_name")
      .in("id", Array.from(participantIds));

    if (profilesError) {
      console.error("Error fetching user profiles:", profilesError);
      toast({
        title: "エラー",
        description: "ユーザープロファイルの取得に失敗しました。",
        variant: "destructive",
      });
      return;
    }

    // プロファイルをIDでマップ化
    const profilesMap = new Map(
      profilesData?.map(profile => [profile.id, profile]) || []
    );

    // 各会話の最後のメッセージを取得
    const conversationsWithLastMessage = await Promise.all(
      conversationsData.map(async (conv) => {
        const { data: lastMessageData } = await supabase
          .from("messages")
          .select("id, content, created_at, user_id")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1);

        return {
          ...conv,
          participant1: profilesMap.get(conv.participant1_id) || null,
          participant2: profilesMap.get(conv.participant2_id) || null,
          other_participant: conv.participant1_id === user.id 
            ? profilesMap.get(conv.participant2_id) || null
            : profilesMap.get(conv.participant1_id) || null,
          last_message: lastMessageData?.[0] || null
        };
      })
    );

    setConversations(conversationsWithLastMessage);
  }, [user.id]);

  // ユーザー検索
  const searchUsers = useCallback(async () => {
    if (!searchEmail.trim() || loading) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, email, display_name")
      .ilike("email", `%${searchEmail}%`)
      .neq("id", user.id)
      .limit(10);

    if (error) {
      console.error("Error searching users:", error);
      toast({
        title: "エラー",
        description: "ユーザー検索に失敗しました。",
        variant: "destructive",
      });
    } else {
      setSearchResults(data || []);
    }
    setLoading(false);
  }, [searchEmail, loading, user.id]);

  // 会話を開始または既存の会話を開く
  const startConversation = async (otherUserId: string) => {
    setLoading(true);
    
    // get_or_create_conversation 関数を呼び出し
    const { data, error } = await supabase.rpc("get_or_create_conversation", {
      user1_id: user.id,
      user2_id: otherUserId,
    });

    if (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "エラー",
        description: "会話の作成に失敗しました。",
        variant: "destructive",
      });
    } else {
      // 会話ページに移動
      window.location.href = `/chat/${data}`;
    }
    setLoading(false);
  };

  useEffect(() => {
    // ユーザープロファイルを作成してから会話一覧を取得
    createUserProfile().then(() => {
      fetchConversations();
    });
  }, []); // fetchConversations is stable

  useEffect(() => {
    if (searchEmail.length >= 2) {
      const timer = setTimeout(searchUsers, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchEmail]); // searchUsers is stable

  const getUserInitials = useCallback((email: string) => {
    return email.substring(0, 2).toUpperCase();
  }, []);

  const getOtherUserInfo = useCallback((conversation: ConversationWithParticipants) => {
    return conversation.other_participant || { email: "不明なユーザー", display_name: "不明" };
  }, []);


  return (
    <div className="flex flex-col h-full">
      {/* 検索とヘッダー */}
      <div className="p-6 border-b space-y-6 bg-background/95">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">チャット一覧</h2>
          <Button
            onClick={() => setShowSearch(!showSearch)}
            size="sm"
            variant="outline"
            className="px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            新しいチャット
          </Button>
        </div>

        {showSearch && (
          <div className="space-y-4">
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="メールアドレスで検索..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-12 py-3 rounded-lg"
                />
              </div>
            </div>

            {searchResults.length > 0 && (
              <ScrollArea className="max-h-52 border rounded-lg shadow-sm bg-background">
                <div className="p-3 space-y-2">
                  {searchResults.map((searchUser) => (
                    <div
                      key={searchUser.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/70 rounded-lg cursor-pointer transition-all duration-150 hover:shadow-sm group"
                      onClick={() => startConversation(searchUser.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12 transition-transform group-hover:scale-105">
                            <AvatarFallback className="text-sm bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-semibold">
                              {getUserInitials(searchUser.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1">
                            <UserStatus userId={searchUser.id} size="sm" />
                          </div>
                        </div>
                        <div className="ml-1">
                          <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {searchUser.display_name || searchUser.email.split('@')[0]}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {searchUser.email}
                          </div>
                        </div>
                      </div>
                      <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </div>

      {/* 会話一覧 */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <p className="text-muted-foreground text-base leading-relaxed">
                まだチャットがありません。
                <br />
                上の「新しいチャット」ボタンから始めましょう。
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Link key={conversation.id} href={`/chat/${conversation.id}`}>
                <Card className="hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:shadow-sm border-l-4 border-l-transparent hover:border-l-primary/20 group mb-3">
                  <CardContent className="p-5">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="w-14 h-14 transition-transform group-hover:scale-105">
                          <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-semibold text-base">
                            {getUserInitials(getOtherUserInfo(conversation).email || '')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          <UserStatus 
                            userId={conversation.other_participant?.id || ''} 
                            size="md" 
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors text-base">
                            {getOtherUserInfo(conversation).display_name || getOtherUserInfo(conversation).email?.split('@')[0] || ''}
                          </h3>
                          <span className="text-xs text-muted-foreground font-medium">
                            {formatConversationTime(conversation.updated_at || '')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate leading-relaxed">
                          {conversation.last_message ? (
                            <>
                              <span className="font-medium text-foreground/70">
                                {conversation.last_message.user_id === user.id ? "あなた" : getOtherUserInfo(conversation).display_name || getOtherUserInfo(conversation).email?.split('@')[0]}:
                              </span>
                              {" " + conversation.last_message.content}
                            </>
                          ) : (
                            <span className="italic">メッセージがありません</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
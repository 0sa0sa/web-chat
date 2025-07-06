"use client";

import { useState, useEffect, useCallback } from "react";
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
      return;
    }

    // プロファイルをIDでマップ化
    const profilesMap = new Map(
      profilesData?.map(profile => [profile.id, profile]) || []
    );

    // 会話データにユーザー情報を結合
    const conversationsWithOtherUser: ConversationWithParticipants[] = conversationsData.map(conv => ({
      ...conv,
      participant1: profilesMap.get(conv.participant1_id) || null,
      participant2: profilesMap.get(conv.participant2_id) || null,
      other_participant: conv.participant1_id === user.id 
        ? profilesMap.get(conv.participant2_id) || null
        : profilesMap.get(conv.participant1_id) || null
    }));

    setConversations(conversationsWithOtherUser);
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

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getOtherUserInfo = (conversation: ConversationWithParticipants) => {
    return conversation.other_participant || { email: "不明なユーザー", display_name: "不明" };
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 検索とヘッダー */}
      <div className="p-0 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">チャット一覧</h2>
          <Button
            onClick={() => setShowSearch(!showSearch)}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            新しいチャット
          </Button>
        </div>

        {showSearch && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="メールアドレスで検索..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {searchResults.length > 0 && (
              <ScrollArea className="max-h-40 border rounded-md">
                <div className="p-2 space-y-1">
                  {searchResults.map((searchUser) => (
                    <div
                      key={searchUser.id}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => startConversation(searchUser.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {getUserInitials(searchUser.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {searchUser.display_name || searchUser.email.split('@')[0]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {searchUser.email}
                          </div>
                        </div>
                      </div>
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
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
        <div className="p-0 pt-4 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                まだチャットがありません。
                <br />
                上の「新しいチャット」ボタンから始めましょう。
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Link key={conversation.id} href={`/chat/${conversation.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {getUserInitials(getOtherUserInfo(conversation).email || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">
                            {getOtherUserInfo(conversation).display_name || getOtherUserInfo(conversation).email?.split('@')[0] || ''}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.updated_at || '')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          最後のメッセージがここに表示されます
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
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import DirectMessageInterface from "@/components/direct-message-interface";

interface ChatRoomPageProps {
  params: {
    conversationId: string;
  };
}

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // 会話の存在と参加権限を確認
  const { data: conversation, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", params.conversationId)
    .single();

  if (error || !conversation) {
    return notFound();
  }

  // ユーザーがこの会話の参加者かチェック
  if (
    conversation.participant1_id !== user.id &&
    conversation.participant2_id !== user.id
  ) {
    return notFound();
  }

  // 相手のユーザー情報を取得
  const otherUserId =
    conversation.participant1_id === user.id
      ? conversation.participant2_id
      : conversation.participant1_id;

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto">
      <DirectMessageInterface
        user={user}
        conversationId={params.conversationId}
        otherUserId={otherUserId}
      />
    </div>
  );
}
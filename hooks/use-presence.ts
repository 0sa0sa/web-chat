"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function usePresence(user: User | null) {
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    // プレゼンスチャンネルに参加
    const channel = supabase.channel(`presence:${user.id}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // プレゼンス状態を送信
    channel
      .on("presence", { event: "sync" }, () => {
        // プレゼンス状態の同期完了
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        // 新しいユーザーが参加
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        // ユーザーが離脱
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // プレゼンス状態を送信
          await channel.track({
            userId: user.id,
            email: user.email,
            online_at: new Date().toISOString(),
          });
        }
      });

    // ページを離れるときにプレゼンス状態をクリア
    const handleBeforeUnload = () => {
      channel.untrack();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);
}
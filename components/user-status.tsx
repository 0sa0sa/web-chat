"use client";

import { useState, useEffect, memo } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserStatusProps {
  userId: string;
  size?: "sm" | "md" | "lg";
}

const UserStatus = memo(function UserStatus({ userId, size = "sm" }: UserStatusProps) {
  const [isOnline, setIsOnline] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    // プレゼンスチャンネルの購読
    const channel = supabase.channel(`presence:${userId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // プレゼンス状態の監視
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const userPresence = state[userId];
        setIsOnline(!!userPresence && userPresence.length > 0);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        if (key === userId) {
          setIsOnline(true);
        }
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        if (key === userId) {
          setIsOnline(false);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className="relative">
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          ${isOnline ? "bg-green-500" : "bg-gray-400"}
          ${isOnline ? "shadow-green-300" : "shadow-gray-200"}
          shadow-sm
        `}
        title={isOnline ? "オンライン" : "オフライン"}
      />
    </div>
  );
});

export default UserStatus;
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "今";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}分前`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}時間前`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}日前`;
  } else {
    // 1週間以上前の場合は日付を表示
    return messageTime.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      year: messageTime.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

export function formatMessageTime(timestamp: string): string {
  const messageTime = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    // 今日のメッセージは時刻のみ表示
    return messageTime.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInDays === 1) {
    // 昨日のメッセージ
    return `昨日 ${messageTime.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (diffInDays < 7) {
    // 1週間以内のメッセージ
    return messageTime.toLocaleDateString("ja-JP", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    // 1週間以上前のメッセージ
    return messageTime.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export function formatConversationTime(timestamp: string): string {
  const messageTime = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    // 今日
    return messageTime.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInDays === 1) {
    // 昨日
    return "昨日";
  } else if (diffInDays < 7) {
    // 1週間以内
    return messageTime.toLocaleDateString("ja-JP", {
      weekday: "short",
    });
  } else {
    // 1週間以上前
    return messageTime.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
    });
  }
}
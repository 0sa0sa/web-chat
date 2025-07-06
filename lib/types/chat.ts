// Chat related types
export interface Message {
  id: string;
  content: string;
  user_id: string;
  conversation_id: string;
  created_at: string;
  updated_at: string;
  // Extended with user info for display (from JOIN query)
  user?: {
    email?: string;
  } | null;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  updated_at: string;
  // Extended with participant info for display
  participant1?: {
    email?: string;
  } | null;
  participant2?: {
    email?: string;
  } | null;
  // Helper fields
  other_participant?: {
    id: string;
    email?: string;
  } | null;
  last_message?: Message | null;
}

export interface ChatRoom {
  id: string;
  name: string;
  created_at: string;
}

export interface RealtimeMessage {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Message;
  old: Message;
}
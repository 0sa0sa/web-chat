import { Database } from './supabase';

// Supabase generated types
export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];

export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type ConversationInsert = Database['public']['Tables']['conversations']['Insert'];
export type ConversationUpdate = Database['public']['Tables']['conversations']['Update'];

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export type ChatRoom = Database['public']['Tables']['chat_rooms']['Row'];
export type ChatRoomInsert = Database['public']['Tables']['chat_rooms']['Insert'];
export type ChatRoomUpdate = Database['public']['Tables']['chat_rooms']['Update'];

// Extended types for UI/display purposes
export interface MessageWithUser extends Message {
  user?: {
    email?: string;
    display_name?: string;
  } | null;
}

export interface ConversationWithParticipants extends Conversation {
  participant1?: UserProfile | null;
  participant2?: UserProfile | null;
  other_participant?: UserProfile | null;
  last_message?: Message | null;
}

export interface RealtimeMessage {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Message;
  old: Message;
}

// Function types
export type GetOrCreateConversationFunction = Database['public']['Functions']['get_or_create_conversation'];

// Helper types for common operations
export interface ConversationListItem {
  id: string;
  other_user: {
    id: string;
    email: string;
    display_name?: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    user_id: string;
  };
  updated_at: string;
}

export interface CreateConversationParams {
  user1_id: string;
  user2_id: string;
}

export interface SendMessageParams {
  content: string;
  user_id: string;
  conversation_id: string;
}
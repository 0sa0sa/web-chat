// Re-export all types for easier imports
export * from './supabase';
export * from './chat';

// Common type aliases for convenience
import { Database } from './supabase';

export type SupabaseClient = import('@supabase/supabase-js').SupabaseClient<Database>;
export type User = import('@supabase/supabase-js').User;
export type Session = import('@supabase/supabase-js').Session;

// Utility types
export type DatabaseRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type DatabaseInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

export type DatabaseUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];
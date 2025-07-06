// 3D Architecture Visualization Data
// Parsed from mermaid diagrams and structured for Three.js rendering

const DIAGRAM_DATA = {
  'system-architecture': {
    title: '🏗️ Next.js 15 + Supabase Architecture',
    description: 'Full-stack Web Chat System with real-time messaging and authentication',
    nodes: [
      // Client Layer
      { id: 'browsers', label: '🌐 Web Browsers', group: 'client', position: { x: -20, y: 15, z: 0 }, color: '#e3f2fd' },
      { id: 'mobile-browser', label: '📱 Mobile Browser', group: 'client', position: { x: -10, y: 15, z: 0 }, color: '#e3f2fd' },
      { id: 'desktop-browser', label: '🖥️ Desktop Browser', group: 'client', position: { x: 0, y: 15, z: 0 }, color: '#e3f2fd' },
      { id: 'tablet-browser', label: '📱 Tablet Browser', group: 'client', position: { x: 10, y: 15, z: 0 }, color: '#e3f2fd' },
      
      // CDN & Assets Layer
      { id: 'vercel-cdn', label: '🌍 Vercel CDN', group: 'cdn', position: { x: 20, y: 15, z: 0 }, color: '#f3e5f5' },
      { id: 'static-assets', label: '📦 Static Assets', group: 'cdn', position: { x: 25, y: 12, z: 0 }, color: '#f3e5f5' },
      
      // Next.js App Router Layer
      { id: 'nextjs-server', label: '⚛️ Next.js 15 Server', group: 'nextjs', position: { x: -15, y: 10, z: 5 }, color: '#e8f5e8' },
      { id: 'app-layout', label: '🏠 app/layout.tsx', group: 'nextjs', position: { x: -25, y: 8, z: 5 }, color: '#e8f5e8' },
      { id: 'app-page', label: '📄 app/page.tsx', group: 'nextjs', position: { x: -20, y: 8, z: 5 }, color: '#e8f5e8' },
      
      // Authentication Pages
      { id: 'auth-login', label: '🔐 app/auth/login/', group: 'auth-pages', position: { x: -15, y: 8, z: 5 }, color: '#fff3e0' },
      { id: 'auth-signup', label: '📝 app/auth/sign-up/', group: 'auth-pages', position: { x: -10, y: 8, z: 5 }, color: '#fff3e0' },
      { id: 'auth-forgot', label: '❓ app/auth/forgot-password/', group: 'auth-pages', position: { x: -5, y: 8, z: 5 }, color: '#fff3e0' },
      { id: 'auth-confirm', label: '✅ app/auth/confirm/', group: 'auth-pages', position: { x: 0, y: 8, z: 5 }, color: '#fff3e0' },
      
      // Chat Pages
      { id: 'chat-list', label: '💬 app/chat/page.tsx', group: 'chat-pages', position: { x: 5, y: 8, z: 5 }, color: '#e0f2f1' },
      { id: 'chat-room', label: '🏠 app/chat/[conversationId]/', group: 'chat-pages', position: { x: 10, y: 8, z: 5 }, color: '#e0f2f1' },
      { id: 'protected-routes', label: '🛡️ app/protected/', group: 'chat-pages', position: { x: 15, y: 8, z: 5 }, color: '#e0f2f1' },
      
      // Component Layer
      { id: 'ui-components', label: '🎨 components/ui/', group: 'components', position: { x: -25, y: 3, z: 10 }, color: '#fce4ec' },
      { id: 'button-component', label: '🔘 button.tsx', group: 'ui-components', position: { x: -30, y: 1, z: 10 }, color: '#fce4ec' },
      { id: 'input-component', label: '📝 input.tsx', group: 'ui-components', position: { x: -27, y: 1, z: 10 }, color: '#fce4ec' },
      { id: 'card-component', label: '🃏 card.tsx', group: 'ui-components', position: { x: -24, y: 1, z: 10 }, color: '#fce4ec' },
      { id: 'avatar-component', label: '👤 avatar.tsx', group: 'ui-components', position: { x: -21, y: 1, z: 10 }, color: '#fce4ec' },
      
      { id: 'auth-components', label: '🔐 components/auth-related/', group: 'components', position: { x: -15, y: 3, z: 10 }, color: '#fce4ec' },
      { id: 'auth-button', label: '🔐 auth-button.tsx', group: 'auth-components', position: { x: -18, y: 1, z: 10 }, color: '#fce4ec' },
      { id: 'login-form', label: '📝 login-form.tsx', group: 'auth-components', position: { x: -15, y: 1, z: 10 }, color: '#fce4ec' },
      { id: 'signup-form', label: '📝 sign-up-form.tsx', group: 'auth-components', position: { x: -12, y: 1, z: 10 }, color: '#fce4ec' },
      
      { id: 'chat-components', label: '💬 components/chat-related/', group: 'components', position: { x: -5, y: 3, z: 10 }, color: '#fce4ec' },
      { id: 'chat-interface', label: '💬 chat-interface.tsx', group: 'chat-components', position: { x: -8, y: 1, z: 10 }, color: '#fce4ec' },
      { id: 'conversations-list', label: '📋 conversations-list.tsx', group: 'chat-components', position: { x: -5, y: 1, z: 10 }, color: '#fce4ec' },
      { id: 'direct-message', label: '💌 direct-message-interface.tsx', group: 'chat-components', position: { x: -2, y: 1, z: 10 }, color: '#fce4ec' },
      
      // Library Layer
      { id: 'lib-supabase', label: '📚 lib/supabase/', group: 'lib', position: { x: 5, y: 3, z: 10 }, color: '#fff8e1' },
      { id: 'supabase-client', label: '🌐 client.ts', group: 'supabase-lib', position: { x: 2, y: 1, z: 10 }, color: '#fff8e1' },
      { id: 'supabase-server', label: '🖥️ server.ts', group: 'supabase-lib', position: { x: 5, y: 1, z: 10 }, color: '#fff8e1' },
      { id: 'supabase-middleware', label: '⚙️ middleware.ts', group: 'supabase-lib', position: { x: 8, y: 1, z: 10 }, color: '#fff8e1' },
      
      { id: 'lib-types', label: '🏷️ lib/types/', group: 'lib', position: { x: 15, y: 3, z: 10 }, color: '#fff8e1' },
      { id: 'supabase-types', label: '📊 supabase.ts', group: 'types-lib', position: { x: 12, y: 1, z: 10 }, color: '#fff8e1' },
      { id: 'chat-types', label: '💬 chat.ts', group: 'types-lib', position: { x: 15, y: 1, z: 10 }, color: '#fff8e1' },
      { id: 'utils-lib', label: '🛠️ lib/utils/', group: 'lib', position: { x: 25, y: 3, z: 10 }, color: '#fff8e1' },
      
      // Middleware Layer
      { id: 'nextjs-middleware', label: '🛡️ middleware.ts', group: 'middleware', position: { x: -10, y: -2, z: 5 }, color: '#fff9c4' },
      { id: 'session-refresh', label: '🔄 Session Refresh', group: 'middleware', position: { x: -5, y: -2, z: 5 }, color: '#fff9c4' },
      { id: 'auth-check', label: '🔍 Auth Check', group: 'middleware', position: { x: 0, y: -2, z: 5 }, color: '#fff9c4' },
      { id: 'route-guard', label: '🚪 Route Guard', group: 'middleware', position: { x: 5, y: -2, z: 5 }, color: '#fff9c4' },
      
      // Supabase Services Layer
      { id: 'supabase-auth', label: '🔐 Supabase Auth', group: 'supabase', position: { x: -15, y: -7, z: 5 }, color: '#ffebee' },
      { id: 'supabase-db', label: '🗄️ Supabase Database', group: 'supabase', position: { x: -5, y: -7, z: 5 }, color: '#ffebee' },
      { id: 'supabase-realtime', label: '📡 Supabase Realtime', group: 'supabase', position: { x: 5, y: -7, z: 5 }, color: '#ffebee' },
      { id: 'supabase-storage', label: '📁 Supabase Storage', group: 'supabase', position: { x: 15, y: -7, z: 5 }, color: '#ffebee' },
      
      // Database Layer
      { id: 'postgresql', label: '🐘 PostgreSQL', group: 'database', position: { x: -10, y: -12, z: 5 }, color: '#e8eaf6' },
      { id: 'user-profiles', label: '👤 user_profiles', group: 'tables', position: { x: -15, y: -14, z: 10 }, color: '#e8eaf6' },
      { id: 'conversations', label: '💬 conversations', group: 'tables', position: { x: -10, y: -14, z: 10 }, color: '#e8eaf6' },
      { id: 'messages', label: '📝 messages', group: 'tables', position: { x: -5, y: -14, z: 10 }, color: '#e8eaf6' },
      { id: 'chat-rooms', label: '🏠 chat_rooms', group: 'tables', position: { x: 0, y: -14, z: 10 }, color: '#e8eaf6' },
      
      // Database Functions
      { id: 'db-functions', label: '⚙️ Database Functions', group: 'database', position: { x: 5, y: -12, z: 5 }, color: '#e8eaf6' },
      { id: 'get-create-conversation', label: '🔄 get_or_create_conversation()', group: 'db-functions', position: { x: 8, y: -14, z: 10 }, color: '#e8eaf6' },
      { id: 'update-timestamp', label: '⏰ update_conversation_timestamp()', group: 'db-functions', position: { x: 12, y: -14, z: 10 }, color: '#e8eaf6' },
      { id: 'create-user-profile', label: '👤 create_user_profile()', group: 'db-functions', position: { x: 16, y: -14, z: 10 }, color: '#e8eaf6' },
      
      // Security Layer
      { id: 'rls-policies', label: '🛡️ Row Level Security', group: 'security', position: { x: 20, y: -12, z: 5 }, color: '#f3e5f5' },
      { id: 'jwt-tokens', label: '🎫 JWT Tokens', group: 'security', position: { x: 25, y: -10, z: 5 }, color: '#f3e5f5' },
      
      // External Services
      { id: 'email-service', label: '📧 Email Service', group: 'external', position: { x: 30, y: -7, z: 0 }, color: '#e0f7fa' },
      { id: 'analytics', label: '📊 Analytics', group: 'external', position: { x: 30, y: -3, z: 0 }, color: '#e0f7fa' }
    ],
    edges: [
      // Browser to Next.js
      { from: 'browsers', to: 'nextjs-server' },
      { from: 'mobile-browser', to: 'nextjs-server' },
      { from: 'desktop-browser', to: 'nextjs-server' },
      { from: 'tablet-browser', to: 'nextjs-server' },
      
      // CDN connections
      { from: 'browsers', to: 'vercel-cdn' },
      { from: 'vercel-cdn', to: 'static-assets' },
      
      // Next.js App Router
      { from: 'nextjs-server', to: 'app-layout' },
      { from: 'nextjs-server', to: 'app-page' },
      { from: 'app-layout', to: 'auth-login' },
      { from: 'app-layout', to: 'auth-signup' },
      { from: 'app-layout', to: 'chat-list' },
      { from: 'app-layout', to: 'chat-room' },
      
      // Auth flow
      { from: 'auth-login', to: 'login-form' },
      { from: 'auth-signup', to: 'signup-form' },
      { from: 'auth-forgot', to: 'auth-components' },
      { from: 'auth-confirm', to: 'auth-components' },
      
      // Chat flow
      { from: 'chat-list', to: 'conversations-list' },
      { from: 'chat-room', to: 'chat-interface' },
      { from: 'chat-room', to: 'direct-message' },
      
      // Component dependencies
      { from: 'auth-components', to: 'ui-components' },
      { from: 'chat-components', to: 'ui-components' },
      { from: 'login-form', to: 'button-component' },
      { from: 'login-form', to: 'input-component' },
      { from: 'chat-interface', to: 'card-component' },
      { from: 'conversations-list', to: 'avatar-component' },
      
      // Library connections
      { from: 'auth-components', to: 'supabase-client' },
      { from: 'chat-components', to: 'supabase-client' },
      { from: 'supabase-client', to: 'chat-types' },
      { from: 'supabase-server', to: 'supabase-types' },
      
      // Middleware flow
      { from: 'nextjs-server', to: 'nextjs-middleware' },
      { from: 'nextjs-middleware', to: 'supabase-middleware' },
      { from: 'nextjs-middleware', to: 'session-refresh' },
      { from: 'session-refresh', to: 'auth-check' },
      { from: 'auth-check', to: 'route-guard' },
      
      // Supabase services
      { from: 'supabase-client', to: 'supabase-auth' },
      { from: 'supabase-client', to: 'supabase-db' },
      { from: 'supabase-client', to: 'supabase-realtime' },
      { from: 'supabase-server', to: 'supabase-db' },
      
      // Database connections
      { from: 'supabase-db', to: 'postgresql' },
      { from: 'postgresql', to: 'user-profiles' },
      { from: 'postgresql', to: 'conversations' },
      { from: 'postgresql', to: 'messages' },
      { from: 'postgresql', to: 'chat-rooms' },
      
      // Database functions
      { from: 'supabase-db', to: 'db-functions' },
      { from: 'db-functions', to: 'get-create-conversation' },
      { from: 'db-functions', to: 'update-timestamp' },
      { from: 'db-functions', to: 'create-user-profile' },
      
      // Security
      { from: 'postgresql', to: 'rls-policies' },
      { from: 'supabase-auth', to: 'jwt-tokens' },
      
      // Real-time
      { from: 'supabase-realtime', to: 'messages' },
      { from: 'chat-interface', to: 'supabase-realtime' },
      
      // External services
      { from: 'supabase-auth', to: 'email-service' },
      { from: 'nextjs-server', to: 'analytics' }
    ]
  },

  'database-er': {
    title: '🗄️ Supabase PostgreSQL Schema',
    description: 'Detailed database schema with RLS policies, functions, and real-time subscriptions',
    nodes: [
      // Core Tables
      { id: 'auth-users', label: '🔐 auth.users (Supabase)', group: 'auth-schema', position: { x: 0, y: 12, z: 0 }, color: '#e3f2fd' },
      { id: 'user-profiles', label: '👤 user_profiles', group: 'public-schema', position: { x: -15, y: 8, z: 0 }, color: '#e8f5e8' },
      { id: 'conversations', label: '💬 conversations', group: 'public-schema', position: { x: 0, y: 8, z: 0 }, color: '#fff3e0' },
      { id: 'messages', label: '📝 messages', group: 'public-schema', position: { x: 15, y: 8, z: 0 }, color: '#fff3e0' },
      { id: 'chat-rooms', label: '🏠 chat_rooms (Future)', group: 'public-schema', position: { x: -7, y: 4, z: 0 }, color: '#fce4ec' },
      
      // Table Columns Details
      { id: 'user-profiles-cols', label: '📊 Columns\nid: uuid\nemail: text\ndisplay_name: text\ncreated_at: timestamp\nupdated_at: timestamp', group: 'table-details', position: { x: -15, y: 5, z: 5 }, color: '#f1f8e9' },
      { id: 'conversations-cols', label: '📊 Columns\nid: uuid\nparticipant1_id: uuid\nparticipant2_id: uuid\ncreated_at: timestamp\nupdated_at: timestamp', group: 'table-details', position: { x: 0, y: 5, z: 5 }, color: '#f1f8e9' },
      { id: 'messages-cols', label: '📊 Columns\nid: uuid\ncontent: text\nuser_id: uuid\nconversation_id: uuid\ncreated_at: timestamp\nupdated_at: timestamp', group: 'table-details', position: { x: 15, y: 5, z: 5 }, color: '#f1f8e9' },
      
      // Database Functions
      { id: 'db-functions', label: '⚙️ Database Functions', group: 'functions', position: { x: -20, y: 0, z: 0 }, color: '#e8eaf6' },
      { id: 'get-create-conv-func', label: '🔄 get_or_create_conversation()\nTYPE: Function\nPARAMS: participant1_id, participant2_id\nRETURNS: conversation record', group: 'function-details', position: { x: -25, y: -3, z: 5 }, color: '#e8eaf6' },
      { id: 'update-timestamp-func', label: '⏰ update_conversation_timestamp()\nTYPE: Trigger Function\nTRIGGER: After INSERT on messages\nACTION: Updates conversation.updated_at', group: 'function-details', position: { x: -20, y: -3, z: 5 }, color: '#e8eaf6' },
      { id: 'create-profile-func', label: '👤 create_user_profile()\nTYPE: Trigger Function\nTRIGGER: After INSERT on auth.users\nACTION: Creates user_profiles record', group: 'function-details', position: { x: -15, y: -3, z: 5 }, color: '#e8eaf6' },
      
      // RLS Policies
      { id: 'rls-policies', label: '🛡️ Row Level Security', group: 'security', position: { x: 5, y: 0, z: 0 }, color: '#f3e5f5' },
      { id: 'user-profiles-rls', label: '🔒 user_profiles RLS\n• SELECT: auth.uid() = id\n• INSERT: auth.uid() = id\n• UPDATE: auth.uid() = id\n• DELETE: auth.uid() = id', group: 'rls-details', position: { x: 8, y: -3, z: 5 }, color: '#f3e5f5' },
      { id: 'conversations-rls', label: '🔒 conversations RLS\n• SELECT: auth.uid() IN (participant1_id, participant2_id)\n• INSERT: auth.uid() IN (participant1_id, participant2_id)\n• UPDATE: auth.uid() IN (participant1_id, participant2_id)', group: 'rls-details', position: { x: 12, y: -3, z: 5 }, color: '#f3e5f5' },
      { id: 'messages-rls', label: '🔒 messages RLS\n• SELECT: auth.uid() IN (conv participants)\n• INSERT: auth.uid() = user_id\n• UPDATE: auth.uid() = user_id', group: 'rls-details', position: { x: 16, y: -3, z: 5 }, color: '#f3e5f5' },
      
      // Indexes
      { id: 'db-indexes', label: '📇 Database Indexes', group: 'performance', position: { x: 25, y: 0, z: 0 }, color: '#fff8e1' },
      { id: 'user-profiles-idx', label: '📇 user_profiles Indexes\n• idx_user_profiles_email (email)\n• idx_user_profiles_display_name', group: 'index-details', position: { x: 28, y: -3, z: 5 }, color: '#fff8e1' },
      { id: 'conversations-idx', label: '📇 conversations Indexes\n• idx_conversations_participants\n• idx_conversations_updated_at', group: 'index-details', position: { x: 32, y: -3, z: 5 }, color: '#fff8e1' },
      { id: 'messages-idx', label: '📇 messages Indexes\n• idx_messages_conversation_id\n• idx_messages_user_id\n• idx_messages_created_at', group: 'index-details', position: { x: 36, y: -3, z: 5 }, color: '#fff8e1' },
      
      // Real-time Subscriptions
      { id: 'realtime-subs', label: '📡 Real-time Subscriptions', group: 'realtime', position: { x: -10, y: -8, z: 0 }, color: '#e0f2f1' },
      { id: 'messages-realtime', label: '📡 messages table\n• Event: INSERT, UPDATE, DELETE\n• Filter: conversation_id\n• Security: RLS applied', group: 'realtime-details', position: { x: -15, y: -11, z: 5 }, color: '#e0f2f1' },
      { id: 'conversations-realtime', label: '📡 conversations table\n• Event: UPDATE\n• Filter: participant ID\n• Use: Last message timestamp', group: 'realtime-details', position: { x: -5, y: -11, z: 5 }, color: '#e0f2f1' },
      
      // Extensions
      { id: 'pg-extensions', label: '🔌 PostgreSQL Extensions', group: 'extensions', position: { x: 15, y: -8, z: 0 }, color: '#ffe0b2' },
      { id: 'uuid-extension', label: '🔌 uuid-ossp\nPURPOSE: Generate UUIDs\nFUNCTIONS: uuid_generate_v4()', group: 'extension-details', position: { x: 10, y: -11, z: 5 }, color: '#ffe0b2' },
      { id: 'pg-crypto', label: '🔌 pgcrypto\nPURPOSE: Cryptographic functions\nFUNCTIONS: gen_salt(), crypt()', group: 'extension-details', position: { x: 15, y: -11, z: 5 }, color: '#ffe0b2' },
      { id: 'moddatetime', label: '🔌 moddatetime\nPURPOSE: Auto-update timestamps\nTRIGGER: updated_at field updates', group: 'extension-details', position: { x: 20, y: -11, z: 5 }, color: '#ffe0b2' },
      
      // Constraints
      { id: 'constraints', label: '🔗 Table Constraints', group: 'constraints', position: { x: 35, y: -8, z: 0 }, color: '#fff3e0' },
      { id: 'fk-constraints', label: '🔗 Foreign Key Constraints\n• user_profiles.id → auth.users.id\n• conversations.participant1_id → user_profiles.id\n• conversations.participant2_id → user_profiles.id\n• messages.user_id → user_profiles.id\n• messages.conversation_id → conversations.id', group: 'constraint-details', position: { x: 35, y: -11, z: 5 }, color: '#fff3e0' },
      
      // Triggers
      { id: 'triggers', label: '⚡ Database Triggers', group: 'triggers', position: { x: -35, y: -8, z: 0 }, color: '#f8bbd9' },
      { id: 'profile-trigger', label: '⚡ on_auth_user_created\nTABLE: auth.users\nEVENT: AFTER INSERT\nFUNCTION: create_user_profile()', group: 'trigger-details', position: { x: -40, y: -11, z: 5 }, color: '#f8bbd9' },
      { id: 'timestamp-trigger', label: '⚡ on_message_created\nTABLE: messages\nEVENT: AFTER INSERT\nFUNCTION: update_conversation_timestamp()', group: 'trigger-details', position: { x: -35, y: -11, z: 5 }, color: '#f8bbd9' },
      { id: 'moddatetime-trigger', label: '⚡ handle_updated_at\nTABLES: user_profiles, conversations, messages\nEVENT: BEFORE UPDATE\nFUNCTION: moddatetime()', group: 'trigger-details', position: { x: -30, y: -11, z: 5 }, color: '#f8bbd9' }
    ],
    edges: [
      // Core table relationships
      { from: 'auth-users', to: 'user-profiles', relationship: 'One-to-One (FK: id)' },
      { from: 'user-profiles', to: 'conversations', relationship: 'One-to-Many (participant1_id)' },
      { from: 'user-profiles', to: 'conversations', relationship: 'One-to-Many (participant2_id)' },
      { from: 'user-profiles', to: 'messages', relationship: 'One-to-Many (user_id)' },
      { from: 'conversations', to: 'messages', relationship: 'One-to-Many (conversation_id)' },
      
      // Table details connections
      { from: 'user-profiles', to: 'user-profiles-cols' },
      { from: 'conversations', to: 'conversations-cols' },
      { from: 'messages', to: 'messages-cols' },
      
      // Function connections
      { from: 'db-functions', to: 'get-create-conv-func' },
      { from: 'db-functions', to: 'update-timestamp-func' },
      { from: 'db-functions', to: 'create-profile-func' },
      { from: 'conversations', to: 'get-create-conv-func' },
      { from: 'messages', to: 'update-timestamp-func' },
      { from: 'auth-users', to: 'create-profile-func' },
      
      // RLS connections
      { from: 'rls-policies', to: 'user-profiles-rls' },
      { from: 'rls-policies', to: 'conversations-rls' },
      { from: 'rls-policies', to: 'messages-rls' },
      { from: 'user-profiles', to: 'user-profiles-rls' },
      { from: 'conversations', to: 'conversations-rls' },
      { from: 'messages', to: 'messages-rls' },
      
      // Index connections
      { from: 'db-indexes', to: 'user-profiles-idx' },
      { from: 'db-indexes', to: 'conversations-idx' },
      { from: 'db-indexes', to: 'messages-idx' },
      { from: 'user-profiles', to: 'user-profiles-idx' },
      { from: 'conversations', to: 'conversations-idx' },
      { from: 'messages', to: 'messages-idx' },
      
      // Real-time connections
      { from: 'realtime-subs', to: 'messages-realtime' },
      { from: 'realtime-subs', to: 'conversations-realtime' },
      { from: 'messages', to: 'messages-realtime' },
      { from: 'conversations', to: 'conversations-realtime' },
      
      // Extension connections
      { from: 'pg-extensions', to: 'uuid-extension' },
      { from: 'pg-extensions', to: 'pg-crypto' },
      { from: 'pg-extensions', to: 'moddatetime' },
      { from: 'user-profiles', to: 'uuid-extension' },
      { from: 'conversations', to: 'uuid-extension' },
      { from: 'messages', to: 'uuid-extension' },
      
      // Constraint connections
      { from: 'constraints', to: 'fk-constraints' },
      { from: 'user-profiles', to: 'fk-constraints' },
      { from: 'conversations', to: 'fk-constraints' },
      { from: 'messages', to: 'fk-constraints' },
      
      // Trigger connections
      { from: 'triggers', to: 'profile-trigger' },
      { from: 'triggers', to: 'timestamp-trigger' },
      { from: 'triggers', to: 'moddatetime-trigger' },
      { from: 'auth-users', to: 'profile-trigger' },
      { from: 'messages', to: 'timestamp-trigger' },
      { from: 'user-profiles', to: 'moddatetime-trigger' },
      { from: 'conversations', to: 'moddatetime-trigger' },
      { from: 'messages', to: 'moddatetime-trigger' }
    ]
  },

  'component-structure': {
    title: '🧩 Component Structure',
    description: 'Frontend component hierarchy and dependencies',
    nodes: [
      // App Router Layer
      { id: 'root-layout', label: '🏠 layout.tsx', group: 'pages', position: { x: 0, y: 10, z: 0 }, color: '#e3f2fd' },
      { id: 'home-page', label: '📄 page.tsx', group: 'pages', position: { x: -8, y: 8, z: 0 }, color: '#e3f2fd' },
      { id: 'login-page', label: '🔑 login/page.tsx', group: 'pages', position: { x: -4, y: 8, z: 0 }, color: '#e3f2fd' },
      { id: 'signup-page', label: '📝 sign-up/page.tsx', group: 'pages', position: { x: 0, y: 8, z: 0 }, color: '#e3f2fd' },
      { id: 'chat-list-page', label: '📋 chat/page.tsx', group: 'pages', position: { x: 4, y: 8, z: 0 }, color: '#e3f2fd' },
      { id: 'chat-room-page', label: '💬 chat/[id]/page.tsx', group: 'pages', position: { x: 8, y: 8, z: 0 }, color: '#e3f2fd' },
      
      // React Components
      { id: 'auth-button', label: '🔐 AuthButton', group: 'auth-components', position: { x: -8, y: 4, z: 0 }, color: '#f3e5f5' },
      { id: 'login-form', label: '🔑 LoginForm', group: 'auth-components', position: { x: -4, y: 4, z: 0 }, color: '#f3e5f5' },
      { id: 'signup-form', label: '📝 SignUpForm', group: 'auth-components', position: { x: 0, y: 4, z: 0 }, color: '#f3e5f5' },
      { id: 'chat-interface', label: '💬 ChatInterface', group: 'chat-components', position: { x: 4, y: 4, z: 0 }, color: '#e0f2f1' },
      { id: 'conversations-list', label: '📋 ConversationsList', group: 'chat-components', position: { x: 8, y: 4, z: 0 }, color: '#e0f2f1' },
      
      // UI Components
      { id: 'button', label: '🔘 Button', group: 'ui-components', position: { x: -8, y: 0, z: 0 }, color: '#fff8e1' },
      { id: 'input', label: '📝 Input', group: 'ui-components', position: { x: -4, y: 0, z: 0 }, color: '#fff8e1' },
      { id: 'card', label: '🃏 Card', group: 'ui-components', position: { x: 0, y: 0, z: 0 }, color: '#fff8e1' },
      { id: 'avatar', label: '👤 Avatar', group: 'ui-components', position: { x: 4, y: 0, z: 0 }, color: '#fff8e1' },
      { id: 'scroll-area', label: '📜 ScrollArea', group: 'ui-components', position: { x: 8, y: 0, z: 0 }, color: '#fff8e1' },
      
      // Services
      { id: 'supabase-client', label: '🌐 client.ts', group: 'services', position: { x: -4, y: -4, z: 0 }, color: '#fff3e0' },
      { id: 'supabase-server', label: '🖥️ server.ts', group: 'services', position: { x: 0, y: -4, z: 0 }, color: '#fff3e0' },
      { id: 'chat-types', label: '💬 chat.ts', group: 'services', position: { x: 4, y: -4, z: 0 }, color: '#fff3e0' },
      
      // External Dependencies
      { id: 'nextjs', label: '⚛️ Next.js', group: 'external', position: { x: -4, y: -8, z: 0 }, color: '#fce4ec' },
      { id: 'react', label: '⚛️ React', group: 'external', position: { x: 0, y: -8, z: 0 }, color: '#fce4ec' },
      { id: 'tailwind', label: '🎨 Tailwind', group: 'external', position: { x: 4, y: -8, z: 0 }, color: '#fce4ec' }
    ],
    edges: [
      { from: 'root-layout', to: 'react' },
      { from: 'login-page', to: 'login-form' },
      { from: 'signup-page', to: 'signup-form' },
      { from: 'chat-list-page', to: 'conversations-list' },
      { from: 'chat-room-page', to: 'chat-interface' },
      { from: 'auth-button', to: 'supabase-client' },
      { from: 'auth-button', to: 'button' },
      { from: 'login-form', to: 'supabase-client' },
      { from: 'login-form', to: 'button' },
      { from: 'login-form', to: 'input' },
      { from: 'login-form', to: 'card' },
      { from: 'conversations-list', to: 'supabase-client' },
      { from: 'conversations-list', to: 'chat-types' },
      { from: 'conversations-list', to: 'card' },
      { from: 'conversations-list', to: 'avatar' },
      { from: 'chat-interface', to: 'supabase-client' },
      { from: 'chat-interface', to: 'chat-types' },
      { from: 'button', to: 'react' },
      { from: 'button', to: 'tailwind' },
      { from: 'supabase-client', to: 'chat-types' }
    ]
  },

  'auth-flow': {
    title: '🔐 Authentication Flow',
    description: 'User authentication and session management flow',
    nodes: [
      { id: 'start', label: '🚀 User Access', group: 'start', position: { x: 0, y: 12, z: 0 }, color: '#e1f5fe' },
      { id: 'check-session', label: '🔍 Session Check', group: 'decision', position: { x: 0, y: 8, z: 0 }, color: '#fff3e0' },
      { id: 'dashboard', label: '📊 Dashboard', group: 'end', position: { x: 8, y: 4, z: 0 }, color: '#e1f5fe' },
      { id: 'auth-choice', label: '🔐 Auth Choice', group: 'decision', position: { x: -8, y: 4, z: 0 }, color: '#fff3e0' },
      { id: 'signup-form', label: '📝 Sign Up', group: 'process', position: { x: -12, y: 0, z: 0 }, color: '#e8f5e8' },
      { id: 'login-form', label: '🔑 Login', group: 'process', position: { x: -8, y: 0, z: 0 }, color: '#e8f5e8' },
      { id: 'forgot-form', label: '❓ Forgot Password', group: 'process', position: { x: -4, y: 0, z: 0 }, color: '#e8f5e8' },
      { id: 'validate-signup', label: '✅ Validate Sign Up', group: 'decision', position: { x: -12, y: -4, z: 0 }, color: '#fff3e0' },
      { id: 'create-account', label: '👤 Create Account', group: 'process', position: { x: -12, y: -8, z: 0 }, color: '#e8f5e8' },
      { id: 'validate-login', label: '✅ Validate Login', group: 'decision', position: { x: -8, y: -4, z: 0 }, color: '#fff3e0' },
      { id: 'create-session', label: '🔐 Create Session', group: 'process', position: { x: 0, y: 0, z: 0 }, color: '#e8f5e8' },
      { id: 'chat-interface', label: '💬 Chat Interface', group: 'end', position: { x: 8, y: 0, z: 0 }, color: '#e1f5fe' },
      { id: 'logout', label: '🚪 Logout', group: 'process', position: { x: 4, y: 8, z: 0 }, color: '#e8f5e8' }
    ],
    edges: [
      { from: 'start', to: 'check-session' },
      { from: 'check-session', to: 'dashboard' },
      { from: 'check-session', to: 'auth-choice' },
      { from: 'auth-choice', to: 'signup-form' },
      { from: 'auth-choice', to: 'login-form' },
      { from: 'auth-choice', to: 'forgot-form' },
      { from: 'signup-form', to: 'validate-signup' },
      { from: 'validate-signup', to: 'create-account' },
      { from: 'login-form', to: 'validate-login' },
      { from: 'validate-login', to: 'create-session' },
      { from: 'create-account', to: 'create-session' },
      { from: 'create-session', to: 'dashboard' },
      { from: 'dashboard', to: 'chat-interface' },
      { from: 'dashboard', to: 'logout' },
      { from: 'logout', to: 'auth-choice' }
    ]
  },

  'chat-sequence': {
    title: '💬 Chat Sequence',
    description: 'Real-time chat message flow and sequence',
    nodes: [
      { id: 'user-a', label: '👤 User A', group: 'user', position: { x: -12, y: 8, z: 0 }, color: '#e1f5fe' },
      { id: 'browser-a', label: '🌐 Browser A', group: 'client', position: { x: -8, y: 4, z: 0 }, color: '#e8f5e8' },
      { id: 'user-b', label: '👤 User B', group: 'user', position: { x: 12, y: 8, z: 0 }, color: '#e1f5fe' },
      { id: 'browser-b', label: '🌐 Browser B', group: 'client', position: { x: 8, y: 4, z: 0 }, color: '#e8f5e8' },
      { id: 'middleware', label: '⚙️ Middleware', group: 'middleware', position: { x: -4, y: 0, z: 0 }, color: '#fff9c4' },
      { id: 'auth', label: '🔐 Auth', group: 'auth', position: { x: 0, y: 0, z: 0 }, color: '#fff3e0' },
      { id: 'database', label: '🗄️ Database', group: 'storage', position: { x: 4, y: 0, z: 0 }, color: '#ffebee' },
      { id: 'realtime', label: '📡 Realtime', group: 'realtime', position: { x: 8, y: 0, z: 0 }, color: '#f3e5f5' },
      { id: 'websocket-connection', label: '🔌 WebSocket', group: 'connection', position: { x: 0, y: -4, z: 0 }, color: '#e0f2f1' },
      { id: 'message-insert', label: '📝 Insert Message', group: 'process', position: { x: 4, y: -4, z: 0 }, color: '#e8f5e8' },
      { id: 'broadcast', label: '📢 Broadcast', group: 'process', position: { x: 8, y: -4, z: 0 }, color: '#e8f5e8' }
    ],
    edges: [
      { from: 'user-a', to: 'browser-a' },
      { from: 'user-b', to: 'browser-b' },
      { from: 'browser-a', to: 'middleware' },
      { from: 'browser-b', to: 'middleware' },
      { from: 'middleware', to: 'auth' },
      { from: 'browser-a', to: 'websocket-connection' },
      { from: 'browser-b', to: 'websocket-connection' },
      { from: 'websocket-connection', to: 'realtime' },
      { from: 'browser-a', to: 'database' },
      { from: 'database', to: 'message-insert' },
      { from: 'message-insert', to: 'realtime' },
      { from: 'realtime', to: 'broadcast' },
      { from: 'broadcast', to: 'browser-a' },
      { from: 'broadcast', to: 'browser-b' }
    ]
  }
};

// Node type configurations for visual styling
const NODE_TYPES = {
  // Original types
  user: { geometry: 'sphere', size: 1.2, emissive: 0.3 },
  frontend: { geometry: 'box', size: 1.0, emissive: 0.2 },
  middleware: { geometry: 'cylinder', size: 1.0, emissive: 0.2 },
  backend: { geometry: 'octahedron', size: 1.0, emissive: 0.2 },
  auth: { geometry: 'dodecahedron', size: 1.0, emissive: 0.3 },
  
  // Detailed system architecture types
  client: { geometry: 'sphere', size: 1.0, emissive: 0.3 },
  cdn: { geometry: 'icosahedron', size: 0.9, emissive: 0.4 },
  nextjs: { geometry: 'box', size: 1.1, emissive: 0.3 },
  'auth-pages': { geometry: 'dodecahedron', size: 0.9, emissive: 0.25 },
  'chat-pages': { geometry: 'cylinder', size: 0.9, emissive: 0.25 },
  components: { geometry: 'box', size: 0.8, emissive: 0.2 },
  'ui-components': { geometry: 'tetrahedron', size: 0.6, emissive: 0.2 },
  'auth-components': { geometry: 'dodecahedron', size: 0.7, emissive: 0.25 },
  'chat-components': { geometry: 'cylinder', size: 0.7, emissive: 0.25 },
  lib: { geometry: 'octahedron', size: 0.9, emissive: 0.2 },
  'supabase-lib': { geometry: 'octahedron', size: 0.7, emissive: 0.25 },
  'types-lib': { geometry: 'cone', size: 0.6, emissive: 0.2 },
  supabase: { geometry: 'icosahedron', size: 1.2, emissive: 0.35 },
  database: { geometry: 'cylinder', size: 1.3, emissive: 0.3 },
  tables: { geometry: 'box', size: 0.8, emissive: 0.2 },
  'db-functions': { geometry: 'octahedron', size: 0.7, emissive: 0.25 },
  security: { geometry: 'dodecahedron', size: 1.0, emissive: 0.4 },
  external: { geometry: 'tetrahedron', size: 0.8, emissive: 0.3 },
  
  // Database ER types
  'auth-schema': { geometry: 'dodecahedron', size: 1.3, emissive: 0.4 },
  'public-schema': { geometry: 'cylinder', size: 1.1, emissive: 0.3 },
  'table-details': { geometry: 'box', size: 0.6, emissive: 0.15 },
  functions: { geometry: 'octahedron', size: 1.0, emissive: 0.3 },
  'function-details': { geometry: 'octahedron', size: 0.7, emissive: 0.2 },
  'rls-details': { geometry: 'dodecahedron', size: 0.7, emissive: 0.3 },
  performance: { geometry: 'torus', size: 1.0, emissive: 0.25 },
  'index-details': { geometry: 'torus', size: 0.6, emissive: 0.2 },
  realtime: { geometry: 'icosahedron', size: 1.0, emissive: 0.35 },
  'realtime-details': { geometry: 'icosahedron', size: 0.7, emissive: 0.3 },
  extensions: { geometry: 'sphere', size: 1.0, emissive: 0.25 },
  'extension-details': { geometry: 'sphere', size: 0.6, emissive: 0.2 },
  constraints: { geometry: 'tetrahedron', size: 1.0, emissive: 0.25 },
  'constraint-details': { geometry: 'tetrahedron', size: 0.7, emissive: 0.2 },
  triggers: { geometry: 'cone', size: 1.0, emissive: 0.3 },
  'trigger-details': { geometry: 'cone', size: 0.7, emissive: 0.25 },
  
  // Legacy types for backward compatibility
  pages: { geometry: 'box', size: 0.8, emissive: 0.2 },
  services: { geometry: 'octahedron', size: 0.8, emissive: 0.2 },
  profile: { geometry: 'sphere', size: 1.0, emissive: 0.2 },
  chat: { geometry: 'cylinder', size: 1.0, emissive: 0.2 },
  future: { geometry: 'cone', size: 0.8, emissive: 0.15 },
  analytics: { geometry: 'torus', size: 0.8, emissive: 0.2 },
  system: { geometry: 'icosahedron', size: 0.9, emissive: 0.2 },
  start: { geometry: 'sphere', size: 1.3, emissive: 0.4 },
  end: { geometry: 'sphere', size: 1.2, emissive: 0.35 },
  decision: { geometry: 'octahedron', size: 1.0, emissive: 0.3 },
  process: { geometry: 'box', size: 0.9, emissive: 0.2 },
  storage: { geometry: 'cylinder', size: 1.0, emissive: 0.2 },
  connection: { geometry: 'torus', size: 0.8, emissive: 0.25 }
};

// Color schemes for different diagram types
const COLOR_SCHEMES = {
  default: {
    background: 0xffffff,
    ambient: 0x888888,
    directional: 0x444444,
    fog: 0xf5f5f5
  },
  system: {
    background: 0xffffff,
    ambient: 0x888888,
    directional: 0x333333,
    fog: 0xf0f8ff
  },
  database: {
    background: 0xffffff,
    ambient: 0x888888,
    directional: 0x333333,
    fog: 0xf0fff0
  }
};
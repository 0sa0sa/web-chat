# Chat Database Migration Guide

This directory contains the complete SQL migration setup for the 1-on-1 chat functionality.

## 🚀 Quick Start

### Option 1: Single File Migration (Recommended)
Run the consolidated migration file in Supabase Dashboard SQL Editor:

```sql
-- Execute this file in Supabase Dashboard
/supabase/final_chat_migration.sql
```

### Option 2: Individual Migrations (Development)
Execute the numbered migration files in order:

```bash
# Run migrations 001-013 in sequence
supabase migration up
```

## 📁 File Structure

### Production Files
- **`final_chat_migration.sql`** - Complete migration in one file ✅ **USE THIS**
- **`README.md`** - This documentation file

### Development Files (Individual Migrations)
- `migrations/001_create_user_profiles_table.sql` - User profiles table
- `migrations/002_create_conversations_table.sql` - 1-on-1 chat conversations
- `migrations/003_create_messages_table.sql` - Chat messages
- `migrations/004_create_chat_rooms_table.sql` - Future group chat support
- `migrations/005_create_functions.sql` - Business logic functions
- `migrations/006_create_triggers.sql` - Automated processes
- `migrations/007_enable_rls.sql` - Row Level Security
- `migrations/008_create_user_profiles_policies.sql` - User profile permissions
- `migrations/009_create_conversations_policies.sql` - Conversation permissions
- `migrations/010_create_messages_policies.sql` - Message permissions
- `migrations/011_create_chat_rooms_policies.sql` - Chat room permissions
- `migrations/012_enable_realtime.sql` - Real-time subscriptions
- `migrations/013_seed_user_profiles.sql` - Initial data

### Legacy Files (Deprecated)
- ⚠️ `complete_migration.sql` - Old consolidated file (use `final_chat_migration.sql` instead)
- ⚠️ `fix_conversations_relationships.sql` - Hotfix (now integrated)
- ⚠️ `hotfix_signup_error.sql` - Hotfix (now integrated)
- ⚠️ `reset_and_setup.sql` - Development utility

## 🗄️ Database Schema

### Tables
- **`user_profiles`** - Extended user information
  - `id` (UUID, PK) - References auth.users
  - `email` (VARCHAR) - User email address
  - `display_name` (VARCHAR) - User display name
  - `created_at`, `updated_at` - Timestamps

- **`conversations`** - 1-on-1 chat rooms
  - `id` (UUID, PK) - Unique conversation identifier
  - `participant1_id`, `participant2_id` (UUID) - Chat participants
  - `created_at`, `updated_at` - Timestamps
  - Constraints: Unique participants, no self-chat

- **`messages`** - Chat messages
  - `id` (UUID, PK) - Unique message identifier
  - `content` (TEXT) - Message content
  - `user_id` (UUID) - Message author
  - `conversation_id` (UUID) - Conversation reference
  - `created_at`, `updated_at` - Timestamps

- **`chat_rooms`** - Future group chat functionality
  - `id` (UUID, PK) - Unique room identifier
  - `name` (VARCHAR) - Room name
  - `created_at` - Timestamp

### Functions
- **`update_updated_at_column()`** - Generic timestamp updater
- **`get_or_create_conversation()`** - Manages conversation creation
- **`create_user_profile()`** - Auto-creates profiles on signup
- **`update_conversation_timestamp()`** - Updates conversation activity

### Security (RLS Policies)
- **User Profiles**: View all, insert/update own
- **Conversations**: View/create own conversations only
- **Messages**: Full CRUD on own messages within own conversations
- **Chat Rooms**: Basic read/create access

## 🔧 Features

### ✅ Implemented
- 1-on-1 chat functionality
- Real-time message updates
- User profile management
- Automatic conversation creation
- Row Level Security (RLS)
- Proper foreign key relationships
- Timestamp management
- User search capabilities
- Conversation listing

### 🚧 Future Enhancements
- Group chat functionality (chat_rooms table ready)
- Message editing/deletion
- File attachments
- Message reactions
- Typing indicators
- Message threading

## 🛠️ Usage

### Creating a Chat
```sql
-- Get or create conversation between two users
SELECT get_or_create_conversation('user1-uuid', 'user2-uuid');
```

### Sending Messages
```sql
-- Insert message into conversation
INSERT INTO messages (content, user_id, conversation_id) 
VALUES ('Hello!', 'user-uuid', 'conversation-uuid');
```

### Real-time Subscriptions
```javascript
// Subscribe to messages in a conversation
supabase
  .channel(`messages:${conversationId}`)
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, handleMessageUpdate)
  .subscribe();
```

## 🔍 Troubleshooting

### Common Issues

1. **User Profile Not Created**
   - Ensure auth.users exists before running migration
   - Check if trigger is properly created

2. **Permission Denied**
   - Verify RLS policies are enabled
   - Check user authentication

3. **Duplicate Conversations**
   - Use `get_or_create_conversation()` function
   - Ensures consistent participant ordering

### Verification Query
```sql
-- Check migration status
SELECT 
  (SELECT COUNT(*) FROM user_profiles) as user_profiles_count,
  (SELECT COUNT(*) FROM conversations) as conversations_count,
  (SELECT COUNT(*) FROM messages) as messages_count,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as policies_count;
```

## 📝 Migration History

- **v1.0** - Initial individual migrations (001-013)
- **v1.1** - Added PostgREST relationship fixes
- **v1.2** - Fixed signup trigger security
- **v2.0** - Consolidated into single migration file
- **v2.1** - Added comprehensive documentation

## 🤝 Contributing

When making changes:
1. Update the `final_chat_migration.sql` file
2. Test thoroughly in development
3. Update this README if schema changes
4. Maintain backward compatibility when possible

---

**Note**: Always backup your database before running migrations in production!
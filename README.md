# Chat Application

A real-time 1-on-1 chat application built with Next.js, Supabase, and shadcn/ui.

## Features

- 🔐 **Authentication** - Secure user signup/login
- 💬 **1-on-1 Chat** - Direct messaging between users
- ⚡ **Real-time** - Live message updates with Supabase Realtime
- 🔍 **User Search** - Find and start conversations with other users
- 🎨 **Modern UI** - Built with shadcn/ui components
- 📱 **Responsive** - Works on desktop and mobile
- 🛡️ **Secure** - Row Level Security (RLS) policies

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd web-chat
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup

```sql
-- Run in Supabase SQL Editor
-- 1. Apply migrations
\i supabase/final_chat_migration.sql

-- 2. Add seed data
\i supabase/seed.sql
```

### 4. Create Test Users (Optional)

```bash
cd scripts
npm install
npm run create-users
```

### 5. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Type Safety
npm run type-check      # Run TypeScript checks
npm run gen:types       # Generate Supabase types
npm run update:types    # Update types + type check

# Code Quality
npm run lint            # ESLint
npm run format          # Prettier

# Testing
cd scripts && npm run create-users  # Create test users
```

## Project Structure

```
├── app/                    # Next.js app router
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat pages
│   └── protected/         # Protected routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Custom components
├── lib/                   # Utilities
│   ├── supabase/         # Supabase client config
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
├── scripts/              # Development scripts
│   ├── create-test-users.js
│   └── generate-types.js
└── supabase/             # Database migrations
    ├── final_chat_migration.sql
    └── seed.sql
```

## Database Schema

### Tables

- **`user_profiles`** - Extended user information
- **`conversations`** - 1-on-1 chat rooms
- **`messages`** - Chat messages
- **`chat_rooms`** - Future group chat support

### Key Features

- **Row Level Security** - Users can only access their own data
- **Real-time subscriptions** - Live updates for all tables
- **Automatic triggers** - Profile creation, timestamp updates
- **Foreign key relationships** - Data integrity

## Development Workflow

### Adding New Features

1. **Database Changes**
   ```sql
   -- Add to supabase/final_chat_migration.sql
   ALTER TABLE messages ADD COLUMN is_edited BOOLEAN DEFAULT false;
   ```

2. **Update Types**
   ```bash
   npm run update:types
   ```

3. **Implement Feature**
   ```typescript
   // Use generated types
   import { Message } from '@/lib/types';
   ```

### Type Safety

The project uses Supabase's generated TypeScript types:

```typescript
// Auto-generated from database schema
export type Message = Database['public']['Tables']['messages']['Row'];

// Extended for UI needs
export interface MessageWithUser extends Message {
  user?: {
    email?: string;
    display_name?: string;
  };
}
```

## Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

### Other Platforms

- Update environment variables
- Ensure Node.js 18+ support
- Set build command: `npm run build`
- Set start command: `npm run start`

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Check RLS policies in Supabase
   - Verify user authentication

2. **Type errors after schema changes**
   ```bash
   npm run update:types
   ```

3. **Real-time not working**
   - Check Supabase Realtime is enabled
   - Verify table publications

4. **User profile not created**
   - Check trigger functions
   - Run seed script

### Getting Help

- Check [Supabase Documentation](https://supabase.com/docs)
- Review error logs in browser console
- Verify environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run type checks: `npm run type-check`
5. Submit a pull request

## License

This project is licensed under the MIT License.
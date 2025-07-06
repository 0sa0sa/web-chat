# Supabase チャット機能セットアップ手順

## 1. Supabase Dashboard でのテーブル作成

以下のSQLファイルを順番にSupabase Dashboard のSQL Editorで実行してください：

### 1.1 テーブル作成
`supabase/migrations/001_create_chat_tables.sql` の内容を実行

### 1.2 RLS ポリシー設定
`supabase/migrations/002_create_rls_policies.sql` の内容を実行

### 1.3 Realtime 有効化
`supabase/migrations/003_enable_realtime.sql` の内容を実行

## 2. 手動でのセットアップ（代替方法）

### 2.1 テーブル作成
Supabase Dashboard > Database > Tables で以下のテーブルを作成：

#### messages テーブル
- `id`: UUID, Primary Key, Default: `gen_random_uuid()`
- `content`: TEXT, Not null
- `user_id`: UUID, Not null, Foreign Key to `auth.users(id)`
- `created_at`: TIMESTAMP WITH TIME ZONE, Default: `NOW()`
- `updated_at`: TIMESTAMP WITH TIME ZONE, Default: `NOW()`

#### chat_rooms テーブル
- `id`: UUID, Primary Key, Default: `gen_random_uuid()`
- `name`: TEXT, Not null
- `created_at`: TIMESTAMP WITH TIME ZONE, Default: `NOW()`

### 2.2 RLS ポリシー設定
Authentication > Policies で以下のポリシーを作成：

#### messages テーブル
- **読み取り**: 認証済みユーザーが全てのメッセージを読み取り可能
- **挿入**: 認証済みユーザーが自分のメッセージを挿入可能
- **更新**: ユーザーが自分のメッセージのみ更新可能
- **削除**: ユーザーが自分のメッセージのみ削除可能

### 2.3 Realtime 有効化
Database > Replication で `messages` テーブルを Realtime に追加

## 3. 環境変数の確認

`.env.local` ファイルに以下の環境変数が設定されていることを確認：

```
NEXT_PUBLIC_SUPABASE_URL=https://bckwkazwbeahjvfxjwoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJja3drYXp3YmVhaGp2Znhqd29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODQ2NDcsImV4cCI6MjA2NzI2MDY0N30.6HWj0y_-t0tDZboBomV2C36ENmaycfbtezk6ymIvOmc
```

## 4. 完了確認

以下の手順で正常にセットアップされたことを確認できます：

1. Supabase Dashboard でテーブルが作成されていることを確認
2. RLS ポリシーが設定されていることを確認
3. Realtime が有効化されていることを確認
4. アプリケーションからテーブルにアクセスできることを確認
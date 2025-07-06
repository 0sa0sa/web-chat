# Supabase Migrations

このディレクトリには1対1チャット機能のためのSupabaseマイグレーションファイルが含まれています。

## 📋 マイグレーション実行順序

以下の順序で**Supabase Dashboard > SQL Editor**で実行してください：

### 🧹 Step 0: クリーンアップ（既存オブジェクトがある場合のみ）
```sql
-- 000_cleanup_old_migrations.sql
```

### 🏗️ Step 1-4: テーブル作成
```sql
-- 001_create_user_profiles_table.sql
-- 002_create_conversations_table.sql
-- 003_create_messages_table.sql
-- 004_create_chat_rooms_table.sql
```

### ⚙️ Step 5-6: 関数とトリガー作成
```sql
-- 005_create_functions.sql
-- 006_create_triggers.sql
```

### 🔒 Step 7-11: セキュリティ設定
```sql
-- 007_enable_rls.sql
-- 008_create_user_profiles_policies.sql
-- 009_create_conversations_policies.sql
-- 010_create_messages_policies.sql
-- 011_create_chat_rooms_policies.sql
```

### ⚡ Step 12-13: Realtimeとデータシード
```sql
-- 012_enable_realtime.sql
-- 013_seed_user_profiles.sql
```

### ✅ Step 999: 検証
```sql
-- 999_verify_migration.sql
```

## 🚀 一括実行方法

### 方法1: 個別実行（推奨）
各ファイルを順番に**Supabase Dashboard > SQL Editor**で実行

### 方法2: 一括実行
全てのファイルの内容を以下の順序で結合して一度に実行：
```bash
# ローカルで結合ファイルを作成
cat 001_*.sql 002_*.sql 003_*.sql 004_*.sql 005_*.sql 006_*.sql 007_*.sql 008_*.sql 009_*.sql 010_*.sql 011_*.sql 012_*.sql 013_*.sql > combined_migration.sql
```

## 📊 各ファイルの内容

| ファイル | 内容 | 依存関係 |
|---------|------|---------|
| `000_cleanup_old_migrations.sql` | 古いオブジェクトのクリーンアップ | - |
| `001_create_user_profiles_table.sql` | ユーザープロファイルテーブル | auth.users |
| `002_create_conversations_table.sql` | 会話テーブル | auth.users |
| `003_create_messages_table.sql` | メッセージテーブル | conversations, auth.users |
| `004_create_chat_rooms_table.sql` | チャットルームテーブル（将来用） | - |
| `005_create_functions.sql` | 各種PL/pgSQL関数 | user_profiles, conversations |
| `006_create_triggers.sql` | トリガー設定 | functions |
| `007_enable_rls.sql` | Row Level Security有効化 | all tables |
| `008_create_user_profiles_policies.sql` | ユーザープロファイルのRLSポリシー | user_profiles |
| `009_create_conversations_policies.sql` | 会話のRLSポリシー | conversations |
| `010_create_messages_policies.sql` | メッセージのRLSポリシー | messages, conversations |
| `011_create_chat_rooms_policies.sql` | チャットルームのRLSポリシー | chat_rooms |
| `012_enable_realtime.sql` | Realtime機能有効化 | all tables |
| `013_seed_user_profiles.sql` | 既存ユーザーのプロファイル作成 | user_profiles, auth.users |
| `999_verify_migration.sql` | マイグレーション検証 | all objects |

## 🔧 トラブルシューティング

### エラー: "relation already exists"
- `000_cleanup_old_migrations.sql` を先に実行

### エラー: "function already exists"
- 関数は `CREATE OR REPLACE` なので通常問題なし

### エラー: "policy already exists"
- ポリシーは `DROP IF EXISTS` してから `CREATE` なので通常問題なし

### Realtime エラー
- `012_enable_realtime.sql` は重複エラーを無視するように設計済み

## ✅ 成功確認

`999_verify_migration.sql` を実行して以下が表示されることを確認：

- 全テーブルが `EXISTS` 
- 全関数が表示される
- RLSが全テーブルで `ENABLED`
- 既存ユーザーのプロファイルが作成されている

## 🔄 ロールバック

必要に応じて、親ディレクトリの `reset_and_setup.sql` でテーブルを削除できます。
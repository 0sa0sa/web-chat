# Test User Creation Scripts

このディレクトリには、チャットアプリケーションのテスト用ユーザーを作成するスクリプトが含まれています。

## 🚀 使用方法

### 1. 事前準備

```bash
# scriptsディレクトリに移動
cd scripts

# 依存関係をインストール
npm install
```

### 2. 環境変数の設定

プロジェクトルートの`.env.local`ファイルに以下が設定されていることを確認：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. テストユーザーの作成

```bash
# テストユーザーを作成
npm run create-users

# または直接実行
node create-test-users.js
```

## 👥 作成されるテストユーザー

| Email | Password | Display Name | Description |
|-------|----------|--------------|-------------|
| alice@test.com | password123 | Alice Smith | Product Manager |
| bob@test.com | password123 | Bob Johnson | Software Engineer |
| charlie@test.com | password123 | Charlie Brown | UX Designer |
| diana@test.com | password123 | Diana Prince | Marketing Lead |
| eve@test.com | password123 | Eve Wilson | Data Analyst |

## 📋 実行手順の全体フロー

### 1. データベースのセットアップ
```sql
-- Supabase Dashboard SQL Editorで実行
-- 1. マイグレーション
/supabase/final_chat_migration.sql

-- 2. シードデータ
/supabase/seed.sql
```

### 2. テストユーザーの作成
```bash
cd scripts
npm install
npm run create-users
```

### 3. 確認
```sql
-- ユーザーが正しく作成されたか確認
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM user_profiles;
```

## 🔧 スクリプトの特徴

### ✅ 安全性
- 既存ユーザーは上書きしない
- エラーハンドリング付き
- レート制限対応（1秒間隔）

### 📊 詳細な出力
- 作成状況をリアルタイム表示
- 最終的な統計情報
- エラー詳細の表示

### 🔄 冪等性
- 複数回実行しても安全
- 既存ユーザーをスキップ

## 🐛 トラブルシューティング

### エラー: "Missing environment variables"
- `.env.local`ファイルの設定を確認
- SupabaseのURL、KEYが正しく設定されているか

### エラー: "Supabase connection failed"
- インターネット接続を確認
- Supabaseプロジェクトの状態を確認
- API KEYの有効性を確認

### エラー: "Email not confirmed"
- Supabaseの設定でメール確認を無効化
- または手動でユーザーの確認状態を変更

## 📝 カスタマイズ

`create-test-users.js`の`testUsers`配列を編集することで、独自のテストユーザーを追加できます：

```javascript
const testUsers = [
  {
    email: 'custom@test.com',
    password: 'password123',
    display_name: 'Custom User',
    description: 'Custom Role'
  }
  // 追加のユーザー...
];
```

## 🎯 次のステップ

1. ✅ テストユーザー作成
2. ✅ データベースシード実行
3. 🔄 チャット機能のテスト
4. 🔄 リアルタイム機能の確認
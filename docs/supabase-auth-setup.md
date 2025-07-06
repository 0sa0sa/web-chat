# Supabase認証・メール設定ガイド

## 🎯 概要

このガイドでは、Supabaseの認証機能と日本語メールテンプレートの設定方法を説明します。

## 📋 前提条件

- Supabaseプロジェクトが作成済み
- Management API アクセストークンの取得
- Node.js 18以上がインストール済み

## 🔑 必要な環境変数

### `.env.local`に追加
```bash
# Supabase Management API (本番デプロイ用)
SUPABASE_ACCESS_TOKEN=sbp_xxx...
SUPABASE_PROJECT_REF=your-project-ref
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### GitHub Secrets に設定
```
SUPABASE_ACCESS_TOKEN=sbp_xxx...
SUPABASE_PROJECT_REF=your-project-ref  
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🚀 セットアップ手順

### 1. Management API トークン取得

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. Account Settings > Access Tokens
3. "Generate new token" をクリック
4. 適切な権限を設定してトークンを生成
5. 環境変数に設定

### 2. ローカル設定

```bash
# 依存関係インストール
cd scripts
npm install

# 認証設定デプロイ
npm run configure-auth
```

### 3. 自動デプロイ設定

メールテンプレートまたは認証設定が変更されると、GitHub Actionsが自動的にデプロイを実行します。

## 📧 メールテンプレート

### 対応メール種別

| テンプレート | ファイル | 用途 |
|-------------|----------|------|
| confirmation | `confirmation.html` | サインアップ確認 |
| recovery | `recovery.html` | パスワードリセット |
| magic_link | `magic_link.html` | マジックリンクログイン |
| invite | `invite.html` | ユーザー招待 |
| email_change | `email_change.html` | メールアドレス変更 |

### テンプレート変数

| 変数 | 説明 | 対応テンプレート |
|------|------|-----------------|
| `{{ .ConfirmationURL }}` | 確認URL | 全テンプレート |
| `{{ .Email }}` | 現在のメール | email_change |
| `{{ .NewEmail }}` | 新しいメール | email_change |

### カスタマイズ

1. `supabase/templates/` 内のHTMLファイルを編集
2. 変更をGitにコミット
3. mainブランチにプッシュで自動デプロイ

## 🔧 認証設定

### config.toml 設定項目

```toml
[auth]
site_url = "https://your-domain.com"
enable_signup = true
enable_email_signup = true
jwt_expiry = 3600

[auth.email]
enable_signup = true
enable_confirmations = true
double_confirm_changes = true
max_frequency = "1m"

# メールテンプレート設定
[auth.email.template.confirmation]
subject = "【チャットアプリ】メールアドレスの確認"
content_path = "./supabase/templates/confirmation.html"
```

### プログラマティック設定

`scripts/configure-auth.js` で以下を設定：

- SMTP設定
- JWT有効期限
- リフレッシュトークン設定
- セキュリティオプション

## 🧪 テスト方法

### 1. テンプレート検証

```bash
# GitHub Actionsでの自動検証
# PRまたはpush時に実行される

# ローカルでの手動検証
npm install -g html-validate
html-validate supabase/templates/*.html
```

### 2. メール送信テスト

1. Supabase Dashboard > Authentication > Settings
2. "Send test email" セクション
3. テンプレート種別を選択して送信

### 3. 実際のフローテスト

```bash
# テストユーザー作成
cd scripts
npm run create-users

# アプリでサインアップ/パスワードリセットをテスト
```

## 🔄 CI/CD ワークフロー

### 自動デプロイトリガー

- `supabase/templates/**` の変更
- `supabase/config.toml` の変更  
- `scripts/configure-auth.js` の変更

### 手動デプロイ

```bash
# GitHub Actions > Deploy Supabase Auth Configuration
# "Run workflow" で手動実行可能
```

## 🐛 トラブルシューティング

### よくある問題

#### 1. "Invalid access token"
```bash
# トークンの有効性確認
curl -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
     https://api.supabase.com/v1/projects

# 新しいトークンを生成して再設定
```

#### 2. "Template not found"
```bash
# ファイル存在確認
ls -la supabase/templates/

# パーミッション確認
chmod 644 supabase/templates/*.html
```

#### 3. "SMTP configuration error"
```bash
# SMTP設定確認
# Supabase Dashboard > Settings > Auth で確認
```

### ログ確認

```bash
# GitHub Actions ログ
# Actions タブ > Deploy Supabase Auth Configuration

# ローカル実行ログ
cd scripts
npm run configure-auth 2>&1 | tee auth-config.log
```

## 📚 参考資料

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Management API](https://supabase.com/docs/reference/api)
- [Email Template Variables](https://supabase.com/docs/guides/auth/auth-email-templates)

## 🔄 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-01-XX | 初版作成 |
| 2025-01-XX | CI/CD設定追加 |
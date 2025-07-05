# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

認証機能付きのフルスタックWebアプリケーションを構築するためのNext.jsとSupabaseのスターターキットです。このプロジェクトは以下の技術を使用しています：
- Next.js 15 with App Router
- Supabase（認証、データベース等のバックエンドサービス）
- TypeScript（型安全性）
- Tailwind CSS（スタイリング）
- shadcn/ui コンポーネント
- next-themes（テーマ切替）

## 一般的な開発コマンド

### 開発
```bash
bun run dev          # Turbopackを使用して開発サーバーを起動
bun run build        # 本番用ビルド
bun run start        # 本番サーバーを起動
bun run lint         # ESLintを実行
bun run type-check   # TypeScriptの型チェックを実行
bun run format      # Prettierでコードをフォーマット
```

### パッケージ管理
このプロジェクトはBunをパッケージマネージャーとして使用しています。依存関係をインストールするには`bun install`を使用してください。

## アーキテクチャとファイル構造

### App Router構造
- `app/` - Next.js App Routerのページとレイアウト
  - `auth/` - 認証ページ（ログイン、サインアップ、パスワードリセット等）
  - `protected/` - 認証が必要な保護されたルート
  - `layout.tsx` - テーマプロバイダーを含むルートレイアウト
  - `page.tsx` - ホームページ

### Supabase統合
- `lib/supabase/` - Supabaseクライアント設定
  - `client.ts` - `createBrowserClient`を使用したブラウザクライアント
  - `server.ts` - Cookieハンドリング付きの`createServerClient`を使用したサーバークライアント
  - `middleware.ts` - セッション管理ミドルウェア
- `middleware.ts` - Supabaseミドルウェアを呼び出すNext.jsミドルウェア

### 認証フロー
認証システムはCookieベースのセッションを使用したSupabase Authを使用しています：
1. ミドルウェア（`middleware.ts`）が全てのリクエストでユーザーセッションを更新
2. 保護されたルートは未認証ユーザーを自動的に`/auth/login`にリダイレクト
3. 認証フォームは`components/`ディレクトリに配置

### コンポーネント
- `components/ui/` - shadcn/ui コンポーネント（Button、Input、Card等）
- `components/` - 認証フォームやテーマスイッチャーを含むカスタムコンポーネント
- テーマにはCSS変数を使用したshadcn/ui "new-york"スタイルを使用

### スタイリング
- CSS変数を使用したカスタムカラーシステム付きのTailwind CSS
- next-themesによるダークモードサポート
- `app/globals.css`のベーススタイル
- アニメーション用の`tailwindcss-animate`を設定

## 必要な環境変数

アプリケーションは以下の環境変数を必要とします：
- `NEXT_PUBLIC_SUPABASE_URL` - SupabaseプロジェクトURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase匿名キー

## 主要な設定ファイル

- `components.json` - エイリアス付きのshadcn/ui設定
- `tsconfig.json` - パスエイリアス（`@/*`）付きのTypeScript設定
- `tailwind.config.ts` - カスタムテーマ付きのTailwind設定
- `next.config.ts` - Next.js設定（最小限）

## 開発メモ

- パッケージ管理にBunを使用（`bun.lockb`参照）
- TypeScriptパスはルートを指す`@/*`エイリアスで設定
- ミドルウェアが自動的にセッション更新を処理
- テーマ切替はシステム設定検出付きのnext-themesで処理
- 全ての認証UIは一貫性のためにshadcn/uiコンポーネントを使用
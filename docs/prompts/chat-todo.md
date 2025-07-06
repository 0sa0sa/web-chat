# チャット機能実装 TODO リスト

## 概要
ログインした人同士でリアルタイムチャットができる機能を実装します。
- Supabase Realtime を使用してリアルタイム通信
- shadcn/ui のチャットコンポーネントを使用してUI構築
- 認証済みユーザーのみがチャットに参加可能

## Phase 1: データベースとバックエンド設定

### 1. Supabase データベース設計 🔥 High Priority
- [ ] `messages` テーブル作成
  - `id` (UUID, Primary Key)
  - `content` (TEXT, メッセージ内容)
  - `user_id` (UUID, 送信者ID, Foreign Key to auth.users)
  - `created_at` (TIMESTAMP, 送信日時)
  - `updated_at` (TIMESTAMP, 更新日時)
- [ ] `chat_rooms` テーブル作成（将来的な拡張用）
  - `id` (UUID, Primary Key)
  - `name` (TEXT, チャットルーム名)
  - `created_at` (TIMESTAMP)
- [ ] Row Level Security (RLS) ポリシー設定
  - 認証済みユーザーのみメッセージ読み取り可能
  - 認証済みユーザーのみメッセージ送信可能
  - ユーザーは自分のメッセージのみ更新・削除可能

### 2. Supabase Realtime 設定 🔥 High Priority
- [ ] `messages` テーブルのRealtime有効化
- [ ] Realtime購読設定の実装
- [ ] 接続エラーハンドリング

## Phase 2: フロントエンド実装

### 3. shadcn/ui チャットコンポーネント 🔥 High Priority
- [ ] shadcn/ui のチャット関連コンポーネント調査
- [ ] 必要なコンポーネントをインストール
  - `npx shadcn-ui@latest add` でチャット関連コンポーネントを追加
- [ ] コンポーネントのカスタマイズ

### 4. チャットページ作成 🔥 High Priority
- [ ] `/app/chat/page.tsx` 作成
- [ ] 認証チェック機能実装
- [ ] チャットレイアウト設計
- [ ] レスポンシブデザイン対応

### 5. リアルタイムメッセージ機能 🔥 High Priority
- [ ] メッセージ送信機能
  - フォーム作成
  - Supabase への INSERT 処理
  - 送信後のフォームクリア
- [ ] メッセージ受信機能
  - Realtime subscription 設定
  - 新メッセージの自動表示
  - スクロール位置の自動調整
- [ ] メッセージ履歴の取得
  - 初期ロード時の過去メッセージ取得
  - ページネーション対応（必要に応じて）

## Phase 3: 追加機能とテスト

### 6. ユーザー情報表示 🔥 High Priority
- [ ] メッセージ送信者名の表示
- [ ] 送信時刻の表示
- [ ] 自分のメッセージと他人のメッセージの区別

### 7. テスト用データ作成 🟡 Medium Priority
- [ ] サンプルユーザー作成
- [ ] サンプルメッセージデータ挿入
- [ ] テスト用のSQLスクリプト作成

### 8. エラーハンドリング 🟡 Medium Priority
- [ ] 送信エラー時の処理
- [ ] 接続エラー時の再接続処理
- [ ] メッセージ送信制限（スパム防止）
- [ ] 空メッセージの送信防止

## Phase 4: UI/UX 改善

### 9. UI/UX 改善 🟢 Low Priority
- [ ] タイピングインジケーター
- [ ] メッセージ削除機能
- [ ] メッセージ編集機能
- [ ] オンライン状態表示
- [ ] 通知機能
- [ ] 絵文字サポート

## 技術的な考慮事項

### セキュリティ
- Row Level Security (RLS) の適切な設定
- メッセージ内容のサニタイズ
- レート制限の実装

### パフォーマンス
- メッセージ履歴の効率的な取得
- 大量のメッセージに対する仮想化
- 接続の最適化

### 使用技術
- **フロントエンド**: Next.js 15, TypeScript, shadcn/ui
- **バックエンド**: Supabase (Database, Auth, Realtime)
- **スタイリング**: Tailwind CSS
- **状態管理**: React hooks (useState, useEffect)

## 完了条件
- [ ] ログイン済みユーザーがチャットページにアクセス可能
- [ ] メッセージの送信・受信がリアルタイムで動作
- [ ] 複数ユーザーが同時にチャット可能
- [ ] 過去のメッセージ履歴が表示される
- [ ] エラーハンドリングが適切に実装されている
- [ ] レスポンシブデザインで様々なデバイスで利用可能

## 次のステップ
1. Supabase でデータベーステーブルを作成
2. shadcn/ui のチャットコンポーネントを調査・インストール
3. 基本的なチャットページを作成
4. リアルタイム機能を実装
5. テストとデバッグ
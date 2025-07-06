# 🌟 システム全体構成図 (3D Enhanced)

Web Chat Systemのシステム全体のアーキテクチャを示す3D風の立体的な図です。

```mermaid
graph TB
    %% Web Chat System - System Architecture
    
    subgraph "User Layer"
        Desktop["🖥️ Desktop User<br/>Chrome/Firefox/Safari"]
        Mobile["📱 Mobile User<br/>iOS/Android Browsers"]  
        Tablet["💻 Tablet User<br/>Touch Interface"]
    end
    
    subgraph "Frontend Layer"
        subgraph "Browser Environment"
            subgraph "React Application"
                Pages["📄 Pages<br/>Home, Auth, Chat"]
                Components["🧩 Components<br/>Forms, UI, Theme"]
                Hooks["🪝 Custom Hooks<br/>Auth, Chat, Theme"]
            end
            
            subgraph "Next.js Runtime"
                AppRouter["🛣️ App Router<br/>File-based Routing"]
                ServerComponents["⚙️ Server Components<br/>SSR Rendering"]
                ClientComponents["💻 Client Components<br/>Interactive UI"]
            end
            
            subgraph "UI Libraries"
                ShadcnUI["🎨 shadcn/ui<br/>Button, Input, Card"]
                TailwindCSS["🎨 Tailwind CSS<br/>Responsive Design"]
                LucideIcons["🎯 Lucide Icons<br/>Icon Library"]
            end
        end
    end
    
    subgraph "Middleware Layer"
        subgraph "Next.js Middleware"
            SessionMgmt["🔐 Session Management<br/>Cookie & Token Handling"]
            RouteProtection["🛡️ Route Protection<br/>Auth Guards"]
        end
        
        subgraph "Supabase Client"
            BrowserClient["🌐 Browser Client<br/>API & Real-time"]
            ServerClient["🖥️ Server Client<br/>Server Queries"]
        end
        
        subgraph "Theme Management"
            DarkMode["🌙 Dark Mode<br/>Theme Toggle"]
            SystemTheme["⚙️ System Theme<br/>OS Detection"]
        end
    end
    
    subgraph "Backend Layer (Supabase)"
        subgraph "Authentication"
            JWTAuth["🔑 JWT Auth<br/>Token Management"]
            UserMgmt["👤 User Management<br/>Account Operations"]
            SessionStore["💾 Session Store<br/>Redis Backend"]
        end
        
        subgraph "Database"
            PostgreSQL[("🗄️ PostgreSQL<br/>Main Database")]
            PostgRESTAPI["🔗 PostgREST API<br/>Auto REST API"]
            subgraph "DB Components"
                Tables["📊 Tables<br/>Users, Messages"]
                Functions["⚙️ Functions<br/>Business Logic"]
                Triggers["⚡ Triggers<br/>Auto Actions"]
                RLSPolicies["🔒 RLS Policies<br/>Security Rules"]
            end
        end
        
        subgraph "Real-time"
            WebSocketServer["📡 WebSocket Server<br/>Real-time Communication"]
            PubSub["📢 Pub/Sub<br/>Message Broadcasting"]
            ChangeDetection["🔍 Change Detection<br/>Database Events"]
        end
        
        subgraph "Storage"
            FileStorage["📁 File Storage<br/>Media Files"]
            CDN["🌍 CDN<br/>Global Delivery"]
        end
    end
    
    %% Connections
    Desktop --> Pages
    Mobile --> Pages
    Tablet --> Pages
    
    Pages --> AppRouter
    Components --> ShadcnUI
    Components --> TailwindCSS
    Components --> LucideIcons
    
    AppRouter --> SessionMgmt
    AppRouter --> RouteProtection
    
    BrowserClient --> JWTAuth
    BrowserClient --> PostgreSQL
    BrowserClient --> WebSocketServer
    
    ServerClient --> PostgreSQL
    
    JWTAuth --> UserMgmt
    PostgreSQL --> Tables
    PostgreSQL --> Functions
    PostgreSQL --> Triggers
    PostgreSQL --> RLSPolicies
    
    WebSocketServer --> PubSub
    WebSocketServer --> ChangeDetection
    
    PostgRESTAPI --> PostgreSQL
    
    %% Styling
    classDef userLayer fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef frontendLayer fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef middlewareLayer fill:#fff9c4,stroke:#f57c00,stroke-width:2px
    classDef backendLayer fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    
    class Desktop,Mobile,Tablet userLayer
    class Pages,Components,Hooks,AppRouter,ServerComponents,ClientComponents,ShadcnUI,TailwindCSS,LucideIcons frontendLayer
    class SessionMgmt,RouteProtection,BrowserClient,ServerClient,DarkMode,SystemTheme middlewareLayer
    class JWTAuth,UserMgmt,SessionStore,PostgreSQL,PostgRESTAPI,Tables,Functions,Triggers,RLSPolicies,WebSocketServer,PubSub,ChangeDetection,FileStorage,CDN backendLayer
```

## 構成要素

### User Layer
- **Desktop User**: デスクトップブラウザからのアクセス
- **Mobile User**: モバイルブラウザからのアクセス
- **Tablet User**: タブレットブラウザからのアクセス

### Frontend Layer
#### React App
- **Pages**: Next.js App Routerによるページコンポーネント
- **Components**: 再利用可能なUIコンポーネント
- **Hooks**: カスタムReactフック

#### Next.js Runtime
- **App Router**: Next.js 15の新しいルーティングシステム
- **Server Components**: サーバーサイドレンダリングコンポーネント
- **Client Components**: クライアントサイドコンポーネント

#### UI Libraries
- **shadcn/ui**: モダンなUIコンポーネントライブラリ
- **Tailwind CSS**: ユーティリティファーストCSSフレームワーク
- **Lucide Icons**: アイコンライブラリ

### Middleware Layer
#### Next.js Middleware
- **Session Management**: ユーザーセッションの管理
- **Route Protection**: ルートアクセス制御

#### Supabase Client
- **Browser Client**: ブラウザ用Supabaseクライアント
- **Server Client**: サーバー用Supabaseクライアント

#### Theme Provider
- **Dark Mode**: ダークモード機能
- **System Theme**: システムテーマ検出

### Backend Layer (Supabase)
#### Authentication
- **JWT Auth**: JWT認証システム
- **User Management**: ユーザー管理
- **Session Store**: セッション保存

#### Database
- **PostgreSQL**: メインデータベース
- **PostgREST API**: 自動生成REST API
- **Database Components**: テーブル、関数、トリガー、RLSポリシー

#### Realtime
- **WebSocket Server**: リアルタイム通信サーバー
- **Pub/Sub**: パブリッシュ/サブスクライブ機能
- **Change Detection**: データ変更検知

#### Storage
- **File Storage**: ファイル保存機能
- **CDN**: コンテンツ配信ネットワーク

## データフロー

1. **ユーザーアクセス**: 各デバイスからブラウザ経由でアクセス
2. **フロントエンド処理**: React Appでページとコンポーネントを表示
3. **ミドルウェア処理**: セッション管理とルート保護
4. **バックエンド処理**: 認証、データベース操作、リアルタイム通信
5. **レスポンス**: バックエンドからフロントエンドにデータを返却
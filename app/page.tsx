import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Users, Zap, Shield, ArrowRight } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-6 flex h-16 items-center">
          <div className="mr-6 flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              WebChat
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              リアルタイムチャット
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              次世代のWebチャットアプリケーション。
              <br />
              シンプルで高速、そして安全。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            {user ? (
              <Link href="/chat">
                <Button size="lg" className="px-8 py-4 text-lg rounded-full hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  チャットを開始
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/sign-up">
                <Button size="lg" className="px-8 py-4 text-lg rounded-full hover:scale-105 transition-transform">
                  今すぐ始める
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">主要機能</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              現代的なチャットアプリケーションに必要な全ての機能を提供
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary/20">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">リアルタイムメッセージング</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    瞬時にメッセージが相手に届く、
                    高速リアルタイムチャット機能
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary/20">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">ユーザー管理</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    簡単なユーザー検索と
                    オンライン状態の確認
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary/20">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">高速パフォーマンス</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Next.jsとSupabaseによる
                    最適化されたパフォーマンス
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary/20">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">セキュアな認証</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Supabase Authによる
                    安全で信頼性の高い認証システム
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary/20">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">モダンUI</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    直感的で美しい
                    ユーザーインターフェース
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary/20">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">レスポンシブデザイン</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    スマートフォンからデスクトップまで
                    全てのデバイスに対応
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA セクション */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">今すぐ始めましょう</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              アカウントを作成して、リアルタイムチャットを体験してください
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link href="/chat">
                <Button size="lg" className="px-10 py-4 text-lg rounded-full hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  チャットルームへ
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/sign-up">
                  <Button size="lg" className="px-10 py-4 text-lg rounded-full hover:scale-105 transition-transform">
                    無料で始める
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="px-10 py-4 text-lg rounded-full">
                    ログイン
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t bg-muted/20 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-semibold hover:underline text-primary"
              rel="noreferrer"
            >
              Supabase
            </a>
            {" & "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              className="font-semibold hover:underline text-primary"
              rel="noreferrer"
            >
              Next.js
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

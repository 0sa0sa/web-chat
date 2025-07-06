import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ConversationsList from "@/components/conversations-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container max-w-4xl mx-auto px-4 flex h-14 items-center">
          <div className="mr-4 flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">チャット</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <ConversationsList user={user} />
        </div>
      </main>
    </div>
  );
}
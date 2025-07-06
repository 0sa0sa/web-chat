import { createClient } from "@/lib/supabase/client";

export async function createUserProfile() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // ユーザープロファイルが既に存在するかチェック
  const { data: existingProfile } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (existingProfile) return;

  // プロファイルを作成
  const { error } = await supabase
    .from("user_profiles")
    .insert({
      id: user.id,
      email: user.email,
      display_name: user.email?.split('@')[0] || "ユーザー",
    });

  if (error) {
    console.error("Error creating user profile:", error);
  }
}
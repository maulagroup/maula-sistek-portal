import type { User } from "@/types";
import { createServerComponentClient } from "@/lib/supabase/server";

export class UserRepository {
  static async getCurrentUser(): Promise<User | null> {
    const supabase = await createServerComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("[UserRepository.getCurrentUser] Error:", error);
      return null;
    }

    return data;
  }
}

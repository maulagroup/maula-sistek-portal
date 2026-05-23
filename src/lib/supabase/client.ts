"use client";

import { createClient } from "@supabase/supabase-js";

export function createClientComponentClient() {
  if (typeof window === "undefined") {
    throw new Error("createClientComponentClient should only be used on the client");
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

"use client";

import { createClient } from "@supabase/supabase-js";

export function createClientComponentClient() {
  if (typeof window === "undefined") {
    return null as any;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return null as any;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

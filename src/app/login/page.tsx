import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";
import { LoginPageClient } from "./login-page-client";

export default async function LoginPage() {
  const supabase = await createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return <LoginPageClient />;
}

import { requireAuth } from "@/lib/auth/server";
import { SettingsPageClient } from "./settings-page-client";

export default async function SettingsPage() {
  await requireAuth();
  return <SettingsPageClient />;
}

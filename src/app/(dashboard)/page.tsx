import { requireAuth } from "@/lib/auth/server";
import { DashboardPageClient } from "./dashboard-page-client";

export default async function DashboardPage() {
  await requireAuth();
  return <DashboardPageClient />;
}

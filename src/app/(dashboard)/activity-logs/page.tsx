import { requireAuth } from "@/lib/auth/server";
import { ActivityLogsPageClient } from "./activity-logs-page-client";

export default async function ActivityLogsPage() {
  await requireAuth();
  return <ActivityLogsPageClient />;
}

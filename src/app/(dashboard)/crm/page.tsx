import { requireAuth } from "@/lib/auth/server";
import { CRMPageClient } from "./crm-page-client";

export default async function CRMPage() {
  await requireAuth();
  return <CRMPageClient />;
}

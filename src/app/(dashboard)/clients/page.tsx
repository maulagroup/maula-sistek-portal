import { requireAuth } from "@/lib/auth/server";
import { ClientsPageClient } from "./clients-page-client";

export default async function ClientsPage() {
  await requireAuth();
  return <ClientsPageClient />;
}

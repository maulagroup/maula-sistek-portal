import { requireAuth } from "@/lib/auth/server";
import { ProjectsPageClient } from "./projects-page-client";

export default async function ProjectsPage() {
  await requireAuth();
  return <ProjectsPageClient />;
}

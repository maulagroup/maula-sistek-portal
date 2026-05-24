import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/server";
import { ProjectRepository } from "@/lib/db/projects";
import { ProjectDetailClient } from "./project-detail-client";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  await requireAuth();
  const project = await ProjectRepository.getById(params.id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}

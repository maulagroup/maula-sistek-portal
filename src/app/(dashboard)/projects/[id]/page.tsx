import { notFound } from "next/navigation";
import { ProjectRepository } from "@/lib/db/projects";
import { UserRepository } from "@/lib/db/users";
import { ProjectDetailClient } from "./project-detail-client";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, currentUser] = await Promise.all([
    ProjectRepository.getById(params.id),
    UserRepository.getCurrentUser(),
  ]);

  if (!project) {
    notFound();
  }

  const isSuperAdmin = currentUser?.role === "superadmin";

  return (
    <ProjectDetailClient
      project={project}
      isSuperAdmin={isSuperAdmin}
    />
  );
}

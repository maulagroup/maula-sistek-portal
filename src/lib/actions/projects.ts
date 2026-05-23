"use server";

import { ProjectRepository } from "@/lib/db/projects";
import type { CreateProjectInput, UpdateProjectInput } from "@/types";

export async function getProjects() {
  return await ProjectRepository.getAll();
}

export async function getProjectById(id: string) {
  return await ProjectRepository.getById(id);
}

export async function createProject(input: CreateProjectInput) {
  return await ProjectRepository.create(input);
}

export async function updateProject(input: UpdateProjectInput) {
  return await ProjectRepository.update(input);
}

export async function deleteProject(id: string) {
  await ProjectRepository.delete(id);
  return { success: true };
}

export async function getRenewalReminders() {
  return await ProjectRepository.getRenewalReminders();
}

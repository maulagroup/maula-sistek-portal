"use server";

import { ActivityLogRepository } from "@/lib/db/activity-logs";
import type { CreateActivityLogInput } from "@/types";

export async function getActivityLogsByProjectId(projectId: string) {
  return await ActivityLogRepository.getByProjectId(projectId);
}

export async function getAllActivityLogs() {
  return await ActivityLogRepository.getAll();
}

export async function createActivityLog(input: CreateActivityLogInput) {
  return await ActivityLogRepository.create(input);
}

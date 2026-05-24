import type { ActivityLog, CreateActivityLogInput } from "@/types";
import { createServerComponentClient } from "@/lib/supabase/server";

export class ActivityLogRepository {
  static async getByProjectId(projectId: string): Promise<ActivityLog[]> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("project_logs")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ActivityLogRepository.getByProjectId] Error:", error);
      throw new Error(error.message);
    }

    return data ?? [];
  }

  static async getAll(): Promise<ActivityLog[]> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("project_logs")
      .select(`
        *,
        projects (
          id,
          nama_project,
          clients (
            id,
            nama_client
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ActivityLogRepository.getAll] Error:", error);
      throw new Error(error.message);
    }

    return data ?? [];
  }

  static async create(input: CreateActivityLogInput): Promise<ActivityLog> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("project_logs")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("[ActivityLogRepository.create] Error:", error);
      throw new Error(error.message);
    }

    return data;
  }
}

import type { Project, CreateProjectInput, UpdateProjectInput } from "@/types";
import { createServerComponentClient } from "@/lib/supabase/server";

export class ProjectRepository {
  static async getAll(): Promise<Project[]> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, clients(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ProjectRepository.getAll] Error:", error);
      throw new Error(error.message);
    }

    return data ?? [];
  }

  static async getById(id: string): Promise<Project> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, clients(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[ProjectRepository.getById] Error:", error);
      throw new Error(error.message);
    }

    return data;
  }

  static async create(input: CreateProjectInput): Promise<Project> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("projects")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("[ProjectRepository.create] Error:", error);
      throw new Error(error.message);
    }

    return data;
  }

  static async update(input: UpdateProjectInput): Promise<Project> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("projects")
      .update(input)
      .eq("id", input.id)
      .select()
      .single();

    if (error) {
      console.error("[ProjectRepository.update] Error:", error);
      throw new Error(error.message);
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const supabase = await createServerComponentClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("[ProjectRepository.delete] Error:", error);
      throw new Error(error.message);
    }
  }

  static async getRenewalReminders(): Promise<Project[]> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, clients(*)")
      .not("tanggal_renewal", "is", null)
      .order("tanggal_renewal", { ascending: true });

    if (error) {
      console.error("[ProjectRepository.getRenewalReminders] Error:", error);
      throw new Error(error.message);
    }

    return data ?? [];
  }
}

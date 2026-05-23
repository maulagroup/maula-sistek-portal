import type { Credential, CreateCredentialInput, UpdateCredentialInput } from "@/types";
import { createServerComponentClient } from "@/lib/supabase/server";

export class CredentialRepository {
  static async getAll(): Promise<Credential[]> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("credentials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[CredentialRepository.getAll] Error:", error);
      throw new Error(error.message);
    }

    return data ?? [];
  }

  static async getByProjectId(projectId: string): Promise<Credential[]> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("credentials")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[CredentialRepository.getByProjectId] Error:", error);
      throw new Error(error.message);
    }

    return data ?? [];
  }

  static async create(input: CreateCredentialInput): Promise<Credential> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("credentials")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("[CredentialRepository.create] Error:", error);
      throw new Error(error.message);
    }

    return data;
  }

  static async update(input: UpdateCredentialInput): Promise<Credential> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("credentials")
      .update(input)
      .eq("id", input.id)
      .select()
      .single();

    if (error) {
      console.error("[CredentialRepository.update] Error:", error);
      throw new Error(error.message);
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const supabase = await createServerComponentClient();
    const { error } = await supabase.from("credentials").delete().eq("id", id);

    if (error) {
      console.error("[CredentialRepository.delete] Error:", error);
      throw new Error(error.message);
    }
  }
}

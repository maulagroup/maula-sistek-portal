import type { Client, CreateClientInput, UpdateClientInput } from "@/types";
import { createServerComponentClient } from "@/lib/supabase/server";

export class ClientRepository {
  static async getAll(): Promise<Client[]> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ClientRepository.getAll] Error:", error);
      throw new Error(error.message);
    }

    return data ?? [];
  }

  static async getById(id: string): Promise<Client> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[ClientRepository.getById] Error:", error);
      throw new Error(error.message);
    }

    return data;
  }

  static async create(input: CreateClientInput): Promise<Client> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("clients")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("[ClientRepository.create] Error:", error);
      throw new Error(error.message);
    }

    return data;
  }

  static async update(input: UpdateClientInput): Promise<Client> {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase
      .from("clients")
      .update(input)
      .eq("id", input.id)
      .select()
      .single();

    if (error) {
      console.error("[ClientRepository.update] Error:", error);
      throw new Error(error.message);
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const supabase = await createServerComponentClient();
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      console.error("[ClientRepository.delete] Error:", error);
      throw new Error(error.message);
    }
  }
}

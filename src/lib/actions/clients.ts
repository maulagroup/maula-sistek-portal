"use server"

import { createServerComponentClient } from "@/lib/supabase/server";
import type { CreateClientInput, UpdateClientInput } from "@/types/client";

export async function getClients() {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error (getClients):", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getClientById(id: string) {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase Error (getClientById):", error);
    throw new Error(error.message);
  }

  return data;
}

export async function createClient(input: CreateClientInput) {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from("clients")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createClient):", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateClient(input: UpdateClientInput) {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from("clients")
    .update(input)
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updateClient):", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteClient(id: string) {
  const supabase = createServerComponentClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deleteClient):", error);
    throw new Error(error.message);
  }

  return { success: true };
}

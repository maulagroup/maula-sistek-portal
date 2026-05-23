"use server"

import { createServerComponentClient } from "@/lib/supabase/server";
import type { CreateProjectInput, UpdateProjectInput } from "@/types/project";

export async function getProjects() {
  const supabase = await createServerComponentClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error (getProjects):", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getProjectById(id: string) {
  const supabase = await createServerComponentClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase Error (getProjectById):", error);
    throw new Error(error.message);
  }

  return data;
}

export async function createProject(input: CreateProjectInput) {
  const supabase = await createServerComponentClient();
  const { data, error } = await supabase
    .from("projects")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createProject):", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateProject(input: UpdateProjectInput) {
  const supabase = await createServerComponentClient();
  const { data, error } = await supabase
    .from("projects")
    .update(input)
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updateProject):", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteProject(id: string) {
  const supabase = await createServerComponentClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deleteProject):", error);
    throw new Error(error.message);
  }

  return { success: true };
}

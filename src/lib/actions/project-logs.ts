"use server"

import { createServerComponentClient } from "@/lib/supabase/server"
import type { CreateProjectLogInput } from "@/types/project-log"

const dummyProjectLogs = [
  {
    id: "dummy-1",
    project_id: "dummy-project",
    pesan: "Project Created",
    dibuat_oleh: "Admin",
    created_at: new Date().toISOString(),
  },
]

export async function getProjectLogsByProjectId(projectId: string) {
  try {
    console.log("Fetching project logs for projectId:", projectId)
    console.log("Table used: activity_logs")
    const supabase = await createServerComponentClient()
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase Error (getProjectLogsByProjectId):", JSON.stringify(error, null, 2))
      return dummyProjectLogs
    }

    console.log("Fetched project logs:", data)
    return data ?? dummyProjectLogs
  } catch (err) {
    console.error("Failed to get project logs:", err)
    return dummyProjectLogs
  }
}

export async function getAllProjectLogs() {
  try {
    console.log("Fetching all project logs")
    console.log("Table used: activity_logs")
    const supabase = await createServerComponentClient()
    const { data, error } = await supabase
      .from("activity_logs")
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
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase Error (getAllProjectLogs):", JSON.stringify(error, null, 2))
      return dummyProjectLogs
    }

    console.log("Fetched all project logs:", data)
    return data ?? dummyProjectLogs
  } catch (err) {
    console.error("Failed to get all project logs:", err)
    return dummyProjectLogs
  }
}

export async function createProjectLog(input: CreateProjectLogInput) {
  try {
    console.log("=== Creating Project Log ===")
    console.log("Table used: activity_logs")
    console.log("Input payload:", JSON.stringify(input, null, 2))
    
    const supabase = await createServerComponentClient()
    
    console.log("About to execute Supabase insert...")
    const { data, error } = await supabase
      .from("activity_logs")
      .insert([input])
      .select()
      .single()

    if (error) {
      console.error("=== Supabase Error (createProjectLog) ===")
      console.error("Error details:", JSON.stringify(error, null, 2))
      console.error("Error message:", error.message)
      console.error("Error code:", error.code)
      console.error("Error details:", error.details)
      console.error("Error hint:", error.hint)
      throw error
    }

    console.log("=== Project Log Created Successfully ===")
    console.log("Result:", data)
    return data
  } catch (err) {
    console.error("=== Failed to create project log ===")
    console.error("Full error:", err)
    throw err
  }
}

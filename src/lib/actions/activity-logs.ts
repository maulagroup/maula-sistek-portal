"use server"

import { createServerComponentClient } from "@/lib/supabase/server"
import type { CreateActivityLogInput } from "@/types/activity-log"

const dummyActivityLogs = [
  {
    id: "dummy-1",
    project_id: "dummy-project",
    pesan: "Project berhasil dibuat",
    dibuat_oleh: "Admin",
    created_at: new Date().toISOString(),
  },
]

export async function getActivityLogsByProjectId(projectId: string) {
  try {
    const supabase = await createServerComponentClient()
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase Error (getActivityLogsByProjectId):", error)
      return dummyActivityLogs
    }

    return data ?? dummyActivityLogs
  } catch (err) {
    console.error("Failed to get activity logs:", err)
    return dummyActivityLogs
  }
}

export async function createActivityLog(input: CreateActivityLogInput) {
  try {
    const supabase = await createServerComponentClient()
    const { data, error } = await supabase
      .from("activity_logs")
      .insert([input])
      .select()
      .single()

    if (error) {
      console.error("Supabase Error (createActivityLog):", error)
      throw error
    }

    return data
  } catch (err) {
    console.error("Failed to create activity log:", err)
    throw err
  }
}

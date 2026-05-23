export interface ActivityLog {
  id: string
  project_id: string
  pesan: string
  dibuat_oleh: string
  created_at: string
}

export interface CreateActivityLogInput {
  project_id: string
  pesan: string
  dibuat_oleh: string
}

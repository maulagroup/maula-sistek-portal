export interface ProjectLog {
  id: string
  project_id: string
  pesan: string
  dibuat_oleh: string
  created_at: string
  projects?: {
    id: string
    nama_project: string
    clients?: {
      id: string
      nama_client: string
    }
  }
}

export interface CreateProjectLogInput {
  project_id: string
  pesan: string
  dibuat_oleh: string
}

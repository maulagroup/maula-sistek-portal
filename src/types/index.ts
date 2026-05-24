import type { ProjectStatus, UserRole } from "@/lib/constants";

export interface User {
  id: string;
  nama: string | null;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export interface Client {
  id: string;
  nama_client: string;
  nama_pic: string;
  nomor_wa: string;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  nama_project: string;
  jenis_layanan: string;
  status: ProjectStatus;
  domain: string | null;
  deployment_platform: string | null;
  deadline: string | null;
  harga_project: number | null;
  biaya_renewal: number | null;
  tanggal_renewal: string | null;
  pic_internal: string | null;
  catatan: string | null;
  created_at: string;
  updated_at: string;
  clients?: Client;
}

export interface ActivityLog {
  id: string;
  project_id: string;
  pesan: string;
  dibuat_oleh: string;
  created_at: string;
  projects?: {
    id: string;
    nama_project: string;
    clients?: {
      id: string;
      nama_client: string;
    };
  };
}

export interface Credential {
  id: string;
  project_id: string;
  platform: string;
  email_login: string | null;
  username: string | null;
  password: string | null;
  url_login: string | null;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectLog {
  id: string;
  project_id: string;
  user_id: string | null;
  action: string;
  description: string | null;
  metadata: any | null;
  created_at: string;
}

export type CreateClientInput = Omit<Client, "id" | "created_at" | "updated_at">;
export type UpdateClientInput = Partial<CreateClientInput> & { id: string };

export type CreateProjectInput = Omit<Project, "id" | "created_at" | "updated_at" | "clients">;
export type UpdateProjectInput = Partial<CreateProjectInput> & { id: string };

export type CreateActivityLogInput = Omit<ActivityLog, "id" | "created_at" | "projects">;
export type CreateCredentialInput = Omit<Credential, "id" | "created_at" | "updated_at">;
export type UpdateCredentialInput = Partial<CreateCredentialInput> & { id: string };

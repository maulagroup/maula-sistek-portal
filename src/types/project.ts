export type ProjectStatus =
  | "Leads"
  | "DP & Planning"
  | "UI/UX Design"
  | "Development"
  | "Internal Testing"
  | "Client Review"
  | "Revision"
  | "Pelunasan & Deploy"
  | "Maintenance"
  | "Archived";

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
  clients?: {
    id: string;
    nama_client: string;
    nama_pic: string;
  };
}

export type CreateProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'clients'>;
export type UpdateProjectInput = Partial<CreateProjectInput> & { id: string };

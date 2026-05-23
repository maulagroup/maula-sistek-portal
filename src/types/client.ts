export interface Client {
  id: string;
  nama_client: string;
  nama_pic: string;
  nomor_wa: string;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateClientInput = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type UpdateClientInput = Partial<CreateClientInput> & { id: string };

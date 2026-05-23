"use server";

import { ClientRepository } from "@/lib/db/clients";
import type { CreateClientInput, UpdateClientInput } from "@/types";

export async function getClients() {
  return await ClientRepository.getAll();
}

export async function getClientById(id: string) {
  return await ClientRepository.getById(id);
}

export async function createClient(input: CreateClientInput) {
  return await ClientRepository.create(input);
}

export async function updateClient(input: UpdateClientInput) {
  return await ClientRepository.update(input);
}

export async function deleteClient(id: string) {
  await ClientRepository.delete(id);
  return { success: true };
}

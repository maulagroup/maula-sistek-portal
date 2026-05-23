"use server";

import { CredentialRepository } from "@/lib/db/credentials";
import type { CreateCredentialInput, UpdateCredentialInput } from "@/types";

export async function getCredentials() {
  return await CredentialRepository.getAll();
}

export async function getCredentialsByProjectId(projectId: string) {
  return await CredentialRepository.getByProjectId(projectId);
}

export async function createCredential(input: CreateCredentialInput) {
  return await CredentialRepository.create(input);
}

export async function updateCredential(input: UpdateCredentialInput) {
  return await CredentialRepository.update(input);
}

export async function deleteCredential(id: string) {
  await CredentialRepository.delete(id);
  return { success: true };
}

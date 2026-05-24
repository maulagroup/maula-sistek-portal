"use server";

import { UserRepository } from "@/lib/db/users";

export async function getCurrentUser() {
  return await UserRepository.getCurrentUser();
}

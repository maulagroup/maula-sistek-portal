import { requireAuth } from "@/lib/auth/server";
import { getCredentials } from "@/lib/actions/credentials";
import { CredentialsClient } from "./credentials-client";

export default async function CredentialsPage() {
  await requireAuth();
  const credentials = await getCredentials();
  
  return <CredentialsClient credentials={credentials} />;
}

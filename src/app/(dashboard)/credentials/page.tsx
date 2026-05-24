import { getCredentials } from "@/lib/actions/credentials";
import { CredentialsClient } from "./credentials-client";

export default async function CredentialsPage() {
  const credentials = await getCredentials();
  
  return <CredentialsClient credentials={credentials} />;
}

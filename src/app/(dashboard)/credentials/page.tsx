import { getCredentials } from "@/lib/actions/credentials";
import { getCurrentUser } from "@/lib/actions/users";
import { CredentialsClient } from "./credentials-client";

export default async function CredentialsPage() {
  const [credentials, currentUser] = await Promise.all([
    getCredentials(),
    getCurrentUser(),
  ]);

  const isSuperAdmin = currentUser?.role === "superadmin";

  return (
    <CredentialsClient
      credentials={credentials}
      isSuperAdmin={isSuperAdmin}
    />
  );
}

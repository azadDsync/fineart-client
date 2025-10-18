import SettingsPage from "@/components/auth/settings";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  if (!session.data?.user) redirect("/sign-in");

  return <SettingsPage />;
}

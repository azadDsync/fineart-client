import { AdminShell } from "@/components/admin/AdminShell";
import { AuthorizedEmailsManager } from "@/components/admin/authorized-emails-manager";

export default function AuthorizedEmailsPage() {
  return (
    <AdminShell>
      <AuthorizedEmailsManager />
    </AdminShell>
  );
}

import { RoleGate } from '@/components/auth/RoleGate';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';

export default function AdminPage() {
  return (
    <RoleGate allow={['ADMIN']} redirectTo="/">
      <AdminDashboard />
    </RoleGate>
  );
}

"use client";
import { useAdminStats } from '@/lib/hooks/use-api';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Separator } from '@/components/ui/separator';

export function AdminDashboard() {
  const stats = useAdminStats();

  return (
    <div className="space-y-8 py-6">
      {stats.isLoading && <p className="text-sm text-muted-foreground">Loading overview…</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
        <DashboardCard >
          <CardHeader><CardTitle>Users</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Total: {stats.data?.data.users.total ?? '-'}<br />
            Active: {stats.data?.data.users.active ?? '-'}<br />
            Stale: {stats.data?.data.users.stale ?? '-'}<br />
            Admins: {stats.data?.data.users.admins ?? '-'}
          </CardContent>
        </DashboardCard>
        <DashboardCard>
          <CardHeader><CardTitle>Content</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Paintings: {stats.data?.data.content.paintings ?? '-'}<br />
            Events: {stats.data?.data.content.events ?? '-'}<br />
            Announcements: {stats.data?.data.content.announcements ?? '-'}<br />
            Alumni: {stats.data?.data.content.alumni ?? '-'}
          </CardContent>
        </DashboardCard>
        <DashboardCard>
          <CardHeader><CardTitle>Recent (30d)</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Signups: {stats.data?.data.users.recentSignups ?? '-'}<br />
            New Paintings: {stats.data?.data.content.recentPaintings ?? '-'}<br />
            New Events: {stats.data?.data.content.recentEvents ?? '-'}
          </CardContent>
        </DashboardCard>
      </div>
      <Separator />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink title="Manage Users" href="/admin/users" desc="Search, filter, bulk actions" />
        <QuickLink title="Manage Alumni" href="/admin/alumni" desc="Create, edit, delete" />
        <QuickLink title="Announcements" href="/admin/announcements" desc="Publish updates" />
        <QuickLink title="Events" href="/admin/events" desc="Create and manage events" />
      </div>
      {stats.error && <p className="text-red-500 text-sm">Failed to load stats.</p>}
    </div>
  );
}

function QuickLink({ title, href, desc }: { title: string; href: string; desc: string }) {
  return (
    <DashboardCard className=' shadow-[8px_8px_0px_#000]'>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground ">
        <a href={href} className="underline">Open</a>
        <div className="text-xs mt-1">{desc}</div>
      </CardContent>
    </DashboardCard>
  );
}

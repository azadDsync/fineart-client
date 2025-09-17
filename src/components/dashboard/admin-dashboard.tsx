"use client";
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function AdminDashboard() {
  const stats = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiClient.getAdminStats(),
  });

  return (
    <div className="space-y-8 py-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Users</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Total: {stats.data?.data.users.total ?? '-'}<br />
            Active: {stats.data?.data.users.active ?? '-'}<br />
            Stale: {stats.data?.data.users.stale ?? '-'}<br />
            Admins: {stats.data?.data.users.admins ?? '-'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Content</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Paintings: {stats.data?.data.content.paintings ?? '-'}<br />
            Events: {stats.data?.data.content.events ?? '-'}<br />
            Announcements: {stats.data?.data.content.announcements ?? '-'}<br />
            Alumni: {stats.data?.data.content.alumni ?? '-'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent (30d)</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Signups: {stats.data?.data.users.recentSignups ?? '-'}<br />
            New Paintings: {stats.data?.data.content.recentPaintings ?? '-'}<br />
            New Events: {stats.data?.data.content.recentEvents ?? '-'}
          </CardContent>
        </Card>
      </div>
      <Separator />
      <div>
        <h2 className="text-lg font-semibold mb-4">Management</h2>
        <p className="text-sm text-muted-foreground">(You can add tables & bulk actions later.)</p>
      </div>
      {stats.isLoading && <p>Loading stats...</p>}
      {stats.error && <p className="text-red-500 text-sm">Failed to load stats.</p>}
    </div>
  );
}

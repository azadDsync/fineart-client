"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, User, SearchUsersParams } from "@/types/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

const limit = 10;

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("ALL");
  const [isStale, setIsStale] = useState<string>("ALL");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const queryKey = useMemo(() => ["admin-users", { page, search, role, isStale }], [page, search, role, isStale]);
  const users = useQuery<ApiResponse<User[]>>({
    queryKey,
    queryFn: async () => {
      const params: SearchUsersParams = {
        page,
        limit,
        ...(search ? { search } : {}),
        ...(role && role !== "ALL" ? { role: role as User["role"] } : {}),
        ...(isStale !== "ALL" ? { isStale: isStale === "true" } : {}),
      };
      return apiClient.getUsers(params);
    },
    placeholderData: (prev) => prev,
  });

  const bulkAction = useMutation({
    mutationFn: (action: "make_stale" | "activate" | "promote_to_admin" | "demote_to_member") => {
      const userIds = Object.keys(selected).filter((k) => selected[k]);
      return apiClient.bulkUserAction({ userIds, action });
    },
    onSuccess: (res) => {
      // @ts-expect-error message from server shape
      toast.success(res?.message || "Bulk action applied");
      setSelected({});
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  onError: (err: unknown) => toast.error(getErrorMessage(err, "Bulk action failed")),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { isStale: boolean; role?: User["role"]; expiresAt?: string | null } }) =>
      apiClient.updateUserStatus(id, data),
    onSuccess: (res) => {
      // @ts-expect-error message from server shape
      toast.success(res?.message || "Updated user");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  onError: (err: unknown) => toast.error(getErrorMessage(err, "Update failed")),
  });

  const delUser = useMutation({
    mutationFn: (id: string) => apiClient.deleteUser(id),
    onSuccess: () => {
      toast.success("User deactivated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  onError: (err: unknown) => toast.error(getErrorMessage(err, "Delete failed")),
  });

  const allSelected = useMemo(() => {
    const ids = users.data?.data.map((u: User) => u.id) || [];
    return ids.length > 0 && ids.every((id: string) => selected[id]);
  }, [users.data, selected]);

  const toggleAll = () => {
    const ids = users.data?.data.map((u: User) => u.id) || [];
    const next: Record<string, boolean> = {};
    ids.forEach((id: string) => (next[id] = !allSelected));
    setSelected(next);
  };

  return (
    <AdminShell>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-56"
            />
            <Select value={role} onValueChange={(v) => { setRole(v); setPage(1); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={isStale} onValueChange={(v) => { setIsStale(v); setPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="false">Active</SelectItem>
                <SelectItem value="true">Stale</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => users.refetch()} disabled={users.isFetching}>Refresh</Button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="outline" disabled={bulkAction.isPending} onClick={() => bulkAction.mutate("make_stale")}>Mark stale</Button>
            <Button variant="outline" disabled={bulkAction.isPending} onClick={() => bulkAction.mutate("activate")}>Activate</Button>
            <Button variant="outline" disabled={bulkAction.isPending} onClick={() => bulkAction.mutate("promote_to_admin")}>Promote to admin</Button>
            <Button variant="outline" disabled={bulkAction.isPending} onClick={() => bulkAction.mutate("demote_to_member")}>Demote to member</Button>
          </div>

          <Separator />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2"><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
                  <th className="py-2 pr-2">Name</th>
                  <th className="py-2 pr-2">Email</th>
                  <th className="py-2 pr-2">Role</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.data?.data.map((u: User) => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2 pr-2 align-middle">
                      <input
                        type="checkbox"
                        checked={!!selected[u.id]}
                        onChange={(e) => setSelected((s) => ({ ...s, [u.id]: e.target.checked }))}
                      />
                    </td>
                    <td className="py-2 pr-2 align-middle">
                      <div className="font-medium">{u.name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-2 pr-2 align-middle">{u.email}</td>
                    <td className="py-2 pr-2 align-middle">
                      <Select
                        value={u.role}
                        onValueChange={(v) => updateStatus.mutate({ id: u.id, data: { isStale: u.isStale, role: v as User["role"] } })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 pr-2 align-middle">
                      {u.isStale ? (
                        <span className="text-red-500">Stale</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </td>
                    <td className="py-2 pr-2 align-middle space-x-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: u.id, data: { isStale: !u.isStale } })}>
                        {u.isStale ? "Activate" : "Make stale"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => delUser.mutate(u.id)}>Deactivate</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.isLoading && <div className="py-3 text-sm">Loading…</div>}
            {users.error && <div className="py-3 text-sm text-red-500">Failed to load users</div>}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Page {users.data?.pagination?.page || page} of {users.data?.pagination?.totalPages ?? "—"}
            </div>
            <div className="space-x-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <Button
                variant="outline"
                disabled={!!users.data && ((users.data.pagination?.page || 1) >= (users.data.pagination?.totalPages || 1))}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

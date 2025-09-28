"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Event } from "@/types/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

const limit = 10;

export default function AdminEventsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({ title: "", description: "", location: "", startDate: "", endDate: "" });

  const queryKey = useMemo(() => ["admin-events", { page }], [page]);
  const events = useQuery<ApiResponse<Event[]>>({
    queryKey,
    queryFn: async () => apiClient.getEvents({ page, limit }),
    placeholderData: (prev) => prev,
  });

  const create = useMutation({
    mutationFn: () => apiClient.createEvent(form),
    onSuccess: () => {
      toast.success("Event created");
      setForm({ title: "", description: "", location: "", startDate: "", endDate: "" });
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  onError: (e: unknown) => toast.error(getErrorMessage(e, "Create failed")),
  });

  const handleCreate = () => {
    const title = form.title.trim();
    if (!title) return toast.error('Title is required');
    if (!form.startDate) return toast.error('Start date is required');
    if (!form.endDate) return toast.error('End date is required');
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return toast.error('Please provide valid dates');
    }
    if (end < start) return toast.error('End date must be after start date');
    create.mutate();
  };

  const del = useMutation({
    mutationFn: (id: string) => apiClient.deleteEvent(id),
    onSuccess: () => {
      toast.success("Event deleted");
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  onError: (e: unknown) => toast.error(getErrorMessage(e, "Delete failed")),
  });

  return (
    <AdminShell>
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-3 bg-muted/10">
            <div className="font-medium mb-2">Create event</div>
            <div className="grid sm:grid-cols-2 gap-2">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              <Input placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              <Input placeholder="Start date" type="datetime-local" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              <Input placeholder="End date" type="datetime-local" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="sm:col-span-2" />
            </div>
            <div className="mt-2"><Button onClick={handleCreate} disabled={!form.title.trim() || !form.startDate || !form.endDate || create.isPending}>Create</Button></div>
          </div>
          <Separator />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">Title</th>
                  <th className="py-2 pr-2">Dates</th>
                  <th className="py-2 pr-2">Location</th>
                  <th className="py-2 pr-2">Attendees</th>
                  <th className="py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.data?.data.map((ev) => (
                  <tr key={ev.id} className="border-b">
                    <td className="py-2 pr-2">{ev.title}</td>
                    <td className="py-2 pr-2 whitespace-nowrap">{new Date(ev.startDate).toLocaleString()} → {new Date(ev.endDate).toLocaleString()}</td>
                    <td className="py-2 pr-2">{ev.location || "—"}</td>
                    <td className="py-2 pr-2">{ev.attendeesCount ?? "—"}</td>
                    <td className="py-2 pr-2 space-x-2">
                      <Button size="sm" variant="destructive" onClick={() => del.mutate(ev.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {events.isLoading && <div className="py-3 text-sm">Loading…</div>}
            {events.error && <div className="py-3 text-sm text-red-500">Failed to load events</div>}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Page {events.data?.pagination?.page || page} of {events.data?.pagination?.totalPages ?? "—"}
            </div>
            <div className="space-x-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <Button variant="outline" disabled={!!events.data && ((events.data.pagination?.page || 1) >= (events.data.pagination?.totalPages || 1))} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

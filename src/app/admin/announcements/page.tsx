"use client";
import { useState } from "react";
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from "@/lib/hooks/use-api";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const limit = 10;

export default function AdminAnnouncementsPage() {
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const anns = useAnnouncements({ page, limit }, {
    placeholderData: (prev) => prev,
  });

  const create = useCreateAnnouncement(() => {
    toast.success("Announcement published");
    setTitle("");
    setMessage("");
  });

  const update = useUpdateAnnouncement(() => {
    toast.success("Announcement updated");
  });

  const del = useDeleteAnnouncement(() => {
    toast.success("Announcement deleted");
  });

  return (
    <AdminShell>
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-3 bg-muted/10">
            <div className="font-medium mb-2">Create announcement</div>
            <div className="flex flex-col gap-2">
              <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
              <Button onClick={() => create.mutate({ title: title.trim(), message: message.trim() })} disabled={!title.trim() || !message.trim()}>Publish</Button>
            </div>
          </div>
          <Separator />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">Title</th>
                  <th className="py-2 pr-2">Message</th>
                  <th className="py-2 pr-2">Date</th>
                  <th className="py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {anns.data?.data.map((a) => (
                  <tr key={a.id} className="border-b align-top">
                    <td className="py-2 pr-2 w-64">
                      <Input defaultValue={a.title} onBlur={(e) => {
                        const v = e.target.value.trim();
                        if (v && v !== a.title) update.mutate({ id: a.id, data: { title: v } });
                      }} />
                    </td>
                    <td className="py-2 pr-2">
                      <Textarea defaultValue={a.message} rows={3} onBlur={(e) => {
                        const v = e.target.value.trim();
                        if (v && v !== a.message) update.mutate({ id: a.id, data: { message: v } });
                      }} />
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap">{new Date(a.createdAt).toLocaleString()}</td>
                    <td className="py-2 pr-2 space-x-2 whitespace-nowrap">
                      <Button size="sm" variant="destructive" onClick={() => del.mutate(a.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {anns.isLoading && <div className="py-3 text-sm">Loading…</div>}
            {anns.error && <div className="py-3 text-sm text-red-500">Failed to load announcements</div>}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Page {anns.data?.pagination?.page || page} of {anns.data?.pagination?.totalPages ?? "—"}
            </div>
            <div className="space-x-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <Button variant="outline" disabled={!!anns.data && ((anns.data.pagination?.page || 1) >= (anns.data.pagination?.totalPages || 1))} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

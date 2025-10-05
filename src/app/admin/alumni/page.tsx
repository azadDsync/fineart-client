"use client";
import { useEffect, useMemo, useState } from "react";
import { useAlumni, useAlumniStats, useCreateAlumni, useUpdateAlumni, useDeleteAlumni } from "@/lib/hooks/use-api";
import type { Alumni, SearchAlumniParams, CreateAlumniData, UpdateAlumniData } from "@/types/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

const limit = 10;

export default function AdminAlumniPage() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [batchYear, setBatchYear] = useState<string>("");

  const [editing, setEditing] = useState<Alumni | null>(null);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    batchYear: "", 
    details: "",
    imageUrl: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    github: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        email: editing.email || "",
        batchYear: editing.batchYear?.toString() || "",
        details: editing.details || "",
        imageUrl: editing.imageUrl || "",
        website: editing.website || "",
        linkedin: editing.linkedin || "",
        twitter: editing.twitter || "",
        instagram: editing.instagram || "",
        github: editing.github || "",
      });
    } else {
      setForm({ name: "", email: "", batchYear: "", details: "", imageUrl: "", website: "", linkedin: "", twitter: "", instagram: "", github: "" });
    }
  }, [editing]);

  const queryParams = useMemo<SearchAlumniParams>(() => ({
    page,
    limit,
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    ...(batchYear ? { batchYear: Number(batchYear) } : {}),
  }), [page, name, email, batchYear]);

  const alumni = useAlumni(queryParams, {
    placeholderData: (prev) => prev,
  });

  const stats = useAlumniStats();

  const createAlumni = useCreateAlumni(() => {
    toast.success("Alumni added");
    setEditing(null);
  });

  const updateAlumni = useUpdateAlumni(() => {
    toast.success("Alumni updated");
    setEditing(null);
  });

  const deleteAlumni = useDeleteAlumni(() => {
    toast.success("Alumni deleted");
  });

  const handleSubmit = () => {
    const common = {
      email: form.email.trim() || undefined,
      batchYear: form.batchYear ? Number(form.batchYear) : undefined,
      details: form.details.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      website: form.website.trim() || undefined,
      linkedin: form.linkedin.trim() || undefined,
      twitter: form.twitter.trim() || undefined,
      instagram: form.instagram.trim() || undefined,
      github: form.github.trim() || undefined,
    };
    
    if (editing) {
      const payload: UpdateAlumniData = {
        name: form.name.trim() || undefined,
        ...common,
      };
      updateAlumni.mutate({ id: editing.id, data: payload }, {
        onError: (e) => toast.error(getErrorMessage(e, "Update failed")),
      });
    } else {
      const payload: CreateAlumniData = {
        name: form.name.trim(),
        ...common,
      };
      createAlumni.mutate(payload, {
        onError: (e) => toast.error(getErrorMessage(e, "Create failed")),
      });
    }
  };

  const clearFilters = () => {
    setName("");
    setEmail("");
    setBatchYear("");
    setPage(1);
    alumni.refetch();
  };

  const currentPage = alumni.data?.pagination?.page ?? page;
  const totalPages = alumni.data?.pagination?.totalPages ?? 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <AdminShell>
      <Card>
        <CardHeader>
          <CardTitle>Alumni</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Name</label>
              <Input
                placeholder="Filter by name"
                value={name}
                onChange={(e) => { setName(e.target.value); setPage(1); }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Email</label>
              <Input
                placeholder="Filter by email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setPage(1); }}
                type="email"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Batch year</label>
              <Input
                placeholder="e.g. 2020"
                value={batchYear}
                onChange={(e) => { setBatchYear(e.target.value); setPage(1); }}
                inputMode="numeric"
                type="number"
              />
            </div>
            <div className="flex gap-2 sm:justify-start lg:justify-end">
              <Button variant="outline" onClick={clearFilters} disabled={alumni.isFetching}>Clear</Button>
              <Button onClick={() => alumni.refetch()} disabled={alumni.isFetching}>Refresh</Button>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Total alumni</div>
              <div className="text-2xl font-semibold">{
                typeof stats.data?.data?.totalAlumni === 'number' ? stats.data?.data?.totalAlumni as number : '—'
              }</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Recent (30d)</div>
              <div className="text-2xl font-semibold">{
                typeof stats.data?.data?.recentAdditions === 'number' ? stats.data?.data?.recentAdditions as number : '—'
              }</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Batches tracked</div>
              <div className="text-2xl font-semibold">{stats.data ? Object.keys(stats.data.data?.alumniByBatch || {}).length : "—"}</div>
            </div>
          </div>

          <div className="rounded-md border p-4 bg-muted/10">
            <div className="font-medium mb-3">{editing ? "Edit alumni" : "Add alumni"}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Name *</label>
                <Input placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email</label>
                <Input placeholder="email@example.com" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Batch year</label>
                <Input placeholder="e.g. 2020" inputMode="numeric" type="number" value={form.batchYear} onChange={(e) => setForm((f) => ({ ...f, batchYear: e.target.value }))} />
              </div>
              <div className="space-y-1 md:col-span-2 lg:col-span-3">
                <label className="text-xs text-muted-foreground">Details</label>
                <Input placeholder="Short bio or details" value={form.details} onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Image URL</label>
                <Input placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Website</label>
                <Input placeholder="https://..." value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">LinkedIn</label>
                <Input placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Twitter/X</label>
                <Input placeholder="https://x.com/..." value={form.twitter} onChange={(e) => setForm((f) => ({ ...f, twitter: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Instagram</label>
                <Input placeholder="https://instagram.com/..." value={form.instagram} onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">GitHub</label>
                <Input placeholder="https://github.com/..." value={form.github} onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))} />
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex gap-2 pt-1">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!form.name.trim() || createAlumni.isPending || updateAlumni.isPending}
                >
                  {editing ? "Update" : "Add"}
                </Button>
                {editing && (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditing(null)} 
                    disabled={createAlumni.isPending || updateAlumni.isPending}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2 w-[30%]">Name</th>
                  <th className="py-2 pr-2 w-[35%]">Email</th>
                  <th className="py-2 pr-2 w-[15%]">Batch</th>
                  <th className="py-2 pr-2 w-[20%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {alumni.data?.data.map((a) => (
                  <tr key={a.id} className="border-b">
                    <td className="py-2 pr-2 align-middle">{a.name}</td>
                    <td className="py-2 pr-2 align-middle">{a.email || "—"}</td>
                    <td className="py-2 pr-2 align-middle">{a.batchYear || "—"}</td>
                    <td className="py-2 pr-2">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditing(a)}>Edit</Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => deleteAlumni.mutate(a.id, {
                            onError: (e) => toast.error(getErrorMessage(e, "Delete failed")),
                          })} 
                          disabled={deleteAlumni.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!alumni.isLoading && (!alumni.data?.data || alumni.data.data.length === 0) && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">No alumni found</td>
                  </tr>
                )}
              </tbody>
            </table>
            {alumni.isLoading && <div className="py-3 text-sm">Loading…</div>}
            {alumni.error && <div className="py-3 text-sm text-red-500">Failed to load alumni</div>}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="space-x-2">
              <Button variant="outline" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <Button variant="outline" disabled={isLastPage} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

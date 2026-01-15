"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  useAuthorizedEmails,
  useCreateAuthorizedEmail,
  useBulkCreateAuthorizedEmails,
  useDeleteAuthorizedEmail,
} from "@/lib/hooks/use-api";
import { Trash2, Check } from "lucide-react";
import { format } from "date-fns";

const limit = 10;

export function AuthorizedEmailsManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [bulkNotes, setBulkNotes] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  const { data } = useAuthorizedEmails(
    { page, limit, search },
    { placeholderData: (prev) => prev }
  );

  const create = useCreateAuthorizedEmail(() => {
    toast.success("Email authorized");
    setEmail("");
    setNotes("");
  });

  const bulkCreate = useBulkCreateAuthorizedEmails((data) => {
    const message = (data.data as any).message || `Added ${data.data.length} emails`;
    toast.success(message);
    if ((data.data as any).skipped && (data.data as any).skipped.length > 0) {
      toast.info(`Skipped ${(data.data as any).skipped.length} already authorized`);
    }
    setBulkEmails("");
    setBulkNotes("");
    setShowBulk(false);
  });

  const del = useDeleteAuthorizedEmail(() => {
    toast.success("Email removed");
  });

  const handleAdd = () => {
    if (!email.trim()) return toast.error("Email is required");
    create.mutate({
      email: email.trim().toLowerCase(),
      notes: notes.trim() || undefined,
    });
  };

  const handleBulkAdd = () => {
    const emails = bulkEmails
      .split(/[\n,;]/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e && e.includes("@"));

    if (emails.length === 0) {
      return toast.error("Please enter at least one valid email");
    }

    bulkCreate.mutate({
      emails,
      notes: bulkNotes.trim() || undefined,
    });
  };

  const emails = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authorized Emails</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add single email */}
        <div className="rounded-md border p-3 bg-muted/10">
          <div className="font-medium mb-2">Add authorized email</div>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!email.trim()}>
                Add Email
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowBulk(!showBulk)}
              >
                {showBulk ? "Hide" : "Show"} Bulk Upload
              </Button>
            </div>
          </div>
        </div>

        {/* Bulk upload section */}
        {showBulk && (
          <div className="rounded-md border p-3 bg-muted/10">
            <div className="font-medium mb-2">Bulk add emails (max 100)</div>
            <div className="flex flex-col gap-2">
              <Textarea
                placeholder="Paste emails separated by newlines, commas, or semicolons"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                {
                  bulkEmails
                    .split(/[\n,;]/)
                    .filter((e) => e.trim() && e.includes("@")).length
                }{" "}
                valid emails detected
              </p>
              <Input
                placeholder="Notes (optional)"
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
              />
              <Button onClick={handleBulkAdd}>Upload Emails</Button>
            </div>
          </div>
        )}

        <Separator />

        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search emails..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-2">Email</th>
                <th className="py-2 pr-2 hidden md:table-cell">Notes</th>
                <th className="py-2 pr-2 hidden sm:table-cell">Added On</th>
                <th className="py-2 pr-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {emails.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    {search
                      ? "No emails found"
                      : "No authorized emails yet. Add some to get started."}
                  </td>
                </tr>
              ) : (
                emails.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{item.email}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-2 text-muted-foreground hidden md:table-cell">
                      {item.notes || "-"}
                    </td>
                    <td className="py-2 pr-2 text-muted-foreground hidden sm:table-cell">
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="py-2 pr-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Remove ${item.email}?`))
                            del.mutate(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              Page {page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

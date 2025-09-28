"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Alumni } from "@/types/api";
import { LoadingSpinner } from "@/components/ui/loading";

interface AlumniListProps {
  initialLimit?: number;
}

export const AlumniList: React.FC<AlumniListProps> = ({ initialLimit = 50 }) => {
  const [name, setName] = useState("");
  const [batchYear, setBatchYear] = useState<number | "">("");
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, error, refetch, isFetching } = useQuery<ApiResponse<Alumni[]>>({
    queryKey: ["alumni", { name, batchYear }],
    queryFn: async () =>
      apiClient.getAlumni({ page: 1, limit: 100, name: name || undefined, batchYear: batchYear === "" ? undefined : Number(batchYear) }),
    placeholderData: (prev) => prev,
  });

  const items = data?.data ?? [];

  // optional client-side extra filter across details/links
  const filtered = useMemo(() => {
    if (!name) return items;
    const q = name.toLowerCase();
    return items.filter(a =>
      a.name.toLowerCase().includes(q) ||
      (a.details?.toLowerCase().includes(q) ?? false) ||
      (a.website?.toLowerCase().includes(q) ?? false)
    );
  }, [items, name]);

  const visible = showAll ? filtered : filtered.slice(0, initialLimit);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search name, details…"
              value={name}
              onChange={e => setName(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-md border bg-background w-56"
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Batch year"
              value={batchYear}
              onChange={e => setBatchYear(e.target.value === "" ? "" : Number(e.target.value))}
              className="text-xs px-3 py-1.5 rounded-md border bg-background w-32"
            />
            <button onClick={() => refetch()} disabled={isFetching} className="text-xs underline">Refresh</button>
          </div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{filtered.length} alumni</div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><LoadingSpinner /> Loading…</div>
      ) : error ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">Failed to load alumni</div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map(a => (
            <li key={a.id} className="group rounded-xl border p-5 hover:bg-[#FFD6BA] transition flex flex-col justify-between border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 shadow-[8px_8px_0px_#000]">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-base leading-snug">{a.name}</h3>
                  {a.batchYear !== undefined && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/20 uppercase tracking-wide">{a.batchYear}</span>
                  )}
                </div>
                {a.details && (
                  <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4">{a.details}</p>
                )}
                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {a.email && <span>{a.email}</span>}
                  {a.addedBy?.name && <span>Added by {a.addedBy.name}</span>}
                </div>
              </div>
              {(a.website || a.linkedin || a.twitter || a.instagram || a.github) && (
                <div className="mt-4 pt-3 border-t flex flex-wrap gap-3">
                  {a.website && <a href={a.website} target="_blank" rel="noopener noreferrer" className="text-[11px] underline decoration-dotted hover:decoration-solid">Website »</a>}
                  {a.linkedin && <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="text-[11px] underline decoration-dotted hover:decoration-solid">LinkedIn »</a>}
                  {a.twitter && <a href={a.twitter} target="_blank" rel="noopener noreferrer" className="text-[11px] underline decoration-dotted hover:decoration-solid">Twitter »</a>}
                  {a.instagram && <a href={a.instagram} target="_blank" rel="noopener noreferrer" className="text-[11px] underline decoration-dotted hover:decoration-solid">Instagram »</a>}
                  {a.github && <a href={a.github} target="_blank" rel="noopener noreferrer" className="text-[11px] underline decoration-dotted hover:decoration-solid">GitHub »</a>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!isLoading && filtered.length > initialLimit && !showAll && (
        <div>
          <button onClick={() => setShowAll(true)} className="text-xs px-3 py-1.5 rounded-md border bg-background hover:bg-accent/10 transition">Show all {filtered.length}</button>
        </div>
      )}
      {!isLoading && filtered.length === 0 && (
        <div className="text-sm text-muted-foreground italic">No alumni match your filters.</div>
      )}
    </div>
  );
};

export default AlumniList;

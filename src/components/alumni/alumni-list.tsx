"use client";

import React, { useMemo, useState } from "react";
import { alumniData, alumniDisciplines, alumniTags, AlumniProfile } from "@/lib/mock-content";


interface AlumniListProps {
  items?: AlumniProfile[];
  initialLimit?: number;
}

export const AlumniList: React.FC<AlumniListProps> = ({ items = alumniData, initialLimit = 50 }) => {
  const [discipline, setDiscipline] = useState<string>("All");
  const [tag, setTag] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let arr = items;
    if (discipline !== "All") arr = arr.filter(a => a.discipline === discipline);
    if (tag !== "All") arr = arr.filter(a => a.focusTags.includes(tag));
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.bio.toLowerCase().includes(q) ||
        a.focusTags.some(t => t.toLowerCase().includes(q)) ||
        a.discipline.toLowerCase().includes(q)
      );
    }
    return arr;
  }, [items, discipline, tag, query]);

  const visible = showAll ? filtered : filtered.slice(0, initialLimit);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <select value={discipline} onChange={e => setDiscipline(e.target.value)} className="text-xs px-3 py-1.5 rounded-md border bg-background">
              <option value="All">All Disciplines</option>
              {alumniDisciplines.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={tag} onChange={e => setTag(e.target.value)} className="text-xs px-3 py-1.5 rounded-md border bg-background">
              <option value="All">All Tags</option>
              {alumniTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input
              type="text"
              placeholder="Search name, tag, bio..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-md border bg-background w-56"
            />
          </div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{filtered.length} alumni</div>
        </div>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map(a => (
          <li key={a.id} className="group rounded-xl border p-5 hover:bg-[#FFD6BA] transition flex flex-col justify-between border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 shadow-[8px_8px_0px_#000]">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-base leading-snug">{a.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/20 uppercase tracking-wide">{a.gradYear}</span>
              </div>
              <div className="text-xs text-muted-foreground flex flex-wrap gap-2 items-center">
                <span>{a.discipline}</span>
                <span className="text-neutral-400">•</span>
                <span>{a.location}</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4">{a.bio}</p>
              {a.highlight && <div className="text-[11px] font-medium text-foreground/80 flex items-center gap-1"><span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />{a.highlight}</div>}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {a.focusTags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-foreground/5 dark:bg-white/10 tracking-wide uppercase">{tag}</span>
                ))}
              </div>
            </div>
            {a.website && (
              <div className="mt-4 pt-3 border-t flex">
                <a href={a.website} target="_blank" rel="noopener noreferrer" className="text-[11px] underline decoration-dotted hover:decoration-solid">Website »</a>
              </div>
            )}
          </li>
        ))}
      </ul>

      {filtered.length > initialLimit && !showAll && (
        <div>
          <button onClick={() => setShowAll(true)} className="text-xs px-3 py-1.5 rounded-md border bg-background hover:bg-accent/10 transition">Show all {filtered.length}</button>
        </div>
      )}
      {filtered.length === 0 && (
        <div className="text-sm text-muted-foreground italic">No alumni match your filters.</div>
      )}
    </div>
  );
};

export default AlumniList;

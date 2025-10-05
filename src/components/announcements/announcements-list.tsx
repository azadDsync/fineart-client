"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { useAnnouncements } from "@/lib/hooks/use-api";
import type { Announcement } from "@/types/api";
import { LoadingSpinner } from "@/components/ui/loading";

interface AnnouncementsListProps {
	showFilter?: boolean;
}

export const AnnouncementsList: React.FC<AnnouncementsListProps> = ({ showFilter = true }) => {
	const [search, setSearch] = useState("");

	const { data, isLoading, error, refetch, isFetching } = useAnnouncements({ page: 1, limit: 100 }, {
		placeholderData: (prev) => prev,
	});

	const items = data?.data ?? [];

	const filtered = useMemo(() => {
		if (!search.trim()) return items;
		const q = search.toLowerCase();
		return items.filter(a =>
			a.title.toLowerCase().includes(q) ||
			(a.message?.toLowerCase().includes(q))
		);
	}, [items, search]);

	const formatShortDate = (iso: string) => {
		const d = new Date(iso);
		return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
	};

	const summarize = (s: string, n = 180) => s.length > n ? s.slice(0, n) + '…' : s;

	return (
		<div className="space-y-6">
			{showFilter && (
				<div className="flex flex-wrap items-center gap-2">
					<input
						type="text"
						placeholder="Search announcements…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-64 rounded-md border bg-background px-3 py-2 text-sm border-black dark:border-neutral-700/40 focus:outline-none focus:ring-2 focus:ring-ring"
					/>
					{/* <button onClick={() => refetch()} disabled={isFetching} className="text-xs underline">Refresh</button> */}
				</div>
			)}

			{isLoading ? (
				<div className="flex items-center gap-2 text-sm text-muted-foreground"><LoadingSpinner /> Loading…</div>
			) : error ? (
				<div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">Failed to load announcements</div>
			) : (
				<ul className="space-y-4">
					{filtered.map(an => (
						<li key={an.id} className={clsx(
							"rounded-xl border p-5 transition group hover:bg-[#FFD6BA] border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 ",
						)}>
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2 flex-wrap">
									<span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent/20 tracking-wide uppercase">{formatShortDate(an.createdAt)}</span>
									<h3 className="font-medium text-base leading-snug">{an.title}</h3>
								</div>
								{an.message && (
									<p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">{summarize(an.message)}</p>
								)}
								<div className="mt-1 flex flex-wrap gap-3 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
									{an.author?.name && <span>By {an.author.name}</span>}
								</div>
							</div>
						</li>
					))}
				</ul>
			)}

			{!isLoading && filtered.length === 0 && (
				<div className="text-sm text-muted-foreground italic">No announcements found.</div>
			)}
		</div>
	);
};

export default AnnouncementsList;

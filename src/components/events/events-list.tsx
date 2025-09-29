"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Event } from "@/types/api";
import { LoadingSpinner } from "@/components/ui/loading";

interface EventsListProps {
	showFilter?: boolean;
}

export const EventsList: React.FC<EventsListProps> = ({ showFilter = true }) => {
	const [search, setSearch] = useState("");

	const { data, isLoading, error, refetch, isFetching } = useQuery<ApiResponse<Event[]>>({
		queryKey: ["events", { search }],
		queryFn: async () => apiClient.getEvents({ page: 1, limit: 100 }),
		placeholderData: (prev) => prev,
	});

	const items = data?.data ?? [];

	const filtered = useMemo(() => {
		if (!search.trim()) return items;
		const q = search.toLowerCase();
		return items.filter(ev =>
			ev.title.toLowerCase().includes(q) ||
			(ev.description?.toLowerCase().includes(q)) ||
			(ev.location?.toLowerCase().includes(q))
		);
	}, [items, search]);

	const shortDate = (iso: string) => {
		const d = new Date(iso);
		return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
	};

		const timeStr = (iso: string) => {
			const d = new Date(iso);
			// e.g., 10:00 AM (locale-aware)
			return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
		};

		const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

		const formatTimeRange = (startIso?: string, endIso?: string) => {
			if (!startIso) return null;
			const s = new Date(startIso);
			if (!endIso) return timeStr(startIso);
			const e = new Date(endIso);
			const startTime = s.toString() === 'Invalid Date' ? null : timeStr(startIso);
			const endTime = e.toString() === 'Invalid Date' ? null : timeStr(endIso);
			if (!startTime && !endTime) return null;
			if (startTime && endTime) {
				if (sameDay(s, e)) return `${startTime} – ${endTime}`;
				// If dates differ, include end badge with short date
				return `${startTime} – ${shortDate(endIso)} ${endTime}`;
			}
			return startTime || endTime;
		};

	return (
		<div className="space-y-6">
			{showFilter && (
				<div className="flex flex-wrap items-center gap-2">
					<input
						type="text"
						placeholder="Search events…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-64 rounded-md border bg-background border-black dark:border-neutral-700/40 px-3 py-2 text-sm  focus:outline-none focus:ring-2 focus:ring-ring"
					/>
					{/* <button onClick={() => refetch()} disabled={isFetching} className="text-xs underline">Refresh</button> */}
				</div>
			)}

			{isLoading ? (
				<div className="flex items-center gap-2 text-sm text-muted-foreground"><LoadingSpinner /> Loading…</div>
			) : error ? (
				<div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">Failed to load events</div>
			) : (
				<ul className="space-y-4">
					{filtered.map(ev => (
						<li key={ev.id} className="group rounded-xl border  p-5 hover:bg-[#FFD6BA] transition border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 ">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex-1">
									<h3 className="font-medium text-base leading-snug flex flex-wrap items-center gap-2">
										<span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent/20 tracking-wide uppercase">{shortDate(ev.startDate)}</span>
										{formatTimeRange(ev.startDate, ev.endDate) && (
											<span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 tracking-wide">
												{formatTimeRange(ev.startDate, ev.endDate)}
											</span>
										)}
										{ev.title}
									</h3>
									{ev.description && (
										<p className="mt-1 text-xs text-muted-foreground max-w-2xl leading-relaxed">{ev.description}</p>
									)}
									<div className="mt-2 flex flex-wrap gap-3 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
										{ev.location && <span>{ev.location}</span>}
										{ev.organizer?.name && <span>By {ev.organizer.name}</span>}
										{ev.attendeesCount !== undefined && <span>{ev.attendeesCount} going</span>}
									</div>
								</div>
								<div className="flex items-center gap-2 self-start sm:self-auto">
									<button className="text-xs px-3 py-1.5 rounded-md border bg-background hover:cursor-pointer transition">Details</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}

			{!isLoading && filtered.length === 0 && (
				<div className="text-sm text-muted-foreground italic">No events found.</div>
			)}
		</div>
	);
};

export default EventsList;

"use client";

import React, { useMemo, useState } from "react";
import { eventsData, eventCategories, EventItem } from "@/lib/mock-content";
import clsx from "clsx";

interface EventsListProps {
	items?: EventItem[];
	showFilter?: boolean;
}

export const EventsList: React.FC<EventsListProps> = ({ items = eventsData, showFilter = true }) => {
	const [category, setCategory] = useState<string>("All");
	const filtered = useMemo(() => {
		if (category === "All") return items;
		return items.filter(i => i.category === category);
	}, [category, items]);

	return (
		<div className="space-y-6">
			{showFilter && (
				<div className="flex flex-wrap gap-2">
					{['All', ...eventCategories].map(cat => (
						<button
							key={cat}
							onClick={() => setCategory(cat)}
							className={clsx(
								"text-xs px-3 py-1.5 rounded-md border transition",
								category === cat ? "bg-foreground text-background" : "bg-background hover:bg-accent/10"
							)}
						>{cat}</button>
					))}
				</div>
			)}
			<ul className="space-y-4">
				{filtered.map(ev => (
					<li key={ev.id} className="group rounded-xl border  p-5 hover:bg-[#FFD6BA] transition border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 ">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex-1">
								<h3 className="font-medium text-base leading-snug flex flex-wrap items-center gap-2">
									<span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent/20 tracking-wide uppercase">{ev.shortDate}</span>
									{ev.title}
								</h3>
								<p className="mt-1 text-xs text-muted-foreground max-w-2xl leading-relaxed">{ev.description}</p>
								<div className="mt-2 flex flex-wrap gap-3 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
									<span>{ev.category}</span>
									<span>{ev.location}</span>
									{ev.time && <span>{ev.time}</span>}
								</div>
							</div>
							<div className="flex items-center gap-2 self-start sm:self-auto">
								<button className="text-xs px-3 py-1.5 rounded-md border bg-background hover:cursor-pointer transition">Details</button>
								<button className="text-xs px-3 py-1.5 rounded-md border bg-foreground text-background hover:opacity-90 transition">RSVP</button>
							</div>
						</div>
					</li>
				))}
			</ul>
			{filtered.length === 0 && (
				<div className="text-sm text-muted-foreground italic">No events in this category yet.</div>
			)}
		</div>
	);
};

export default EventsList;

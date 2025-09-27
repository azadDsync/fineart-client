"use client";

import React, { useMemo, useState } from "react";
import { announcementsData, announcementCategories, AnnouncementItem } from "@/lib/mock-content";
import clsx from "clsx";

interface AnnouncementsListProps {
	items?: AnnouncementItem[];
	showFilter?: boolean;
	showPinnedFirst?: boolean;
}

export const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
	items = announcementsData,
	showFilter = true,
	showPinnedFirst = true,
}) => {
	const [category, setCategory] = useState<string>("All");
	const processed = useMemo(() => {
		let arr = items;
		if (category !== "All") arr = arr.filter(a => a.category === category);
		if (showPinnedFirst) {
			arr = [...arr].sort((a, b) => Number(b.pinned || 0) - Number(a.pinned || 0));
		}
		return arr;
	}, [items, category, showPinnedFirst]);

	return (
		<div className="space-y-6">
			{showFilter && (
				<div className="flex flex-wrap gap-2">
					{['All', ...announcementCategories].map(cat => (
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
				{processed.map(an => (
					<li key={an.id} className={clsx(
						"rounded-xl border p-5 transition group hover:bg-[#FFD6BA] border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 ",
						an.pinned && "ring-1 border-black"
					)}>
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2 flex-wrap">
								<span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent/20 tracking-wide uppercase">{an.shortDate}</span>
								{an.pinned && <span className="text-[10px] px-2 py-0.5 rounded bg-foreground  text-background uppercase tracking-wide">Pinned</span>}
								<h3 className="font-medium text-base leading-snug">{an.title}</h3>
							</div>
							<p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">{an.summary}</p>
							<div className="mt-1 flex flex-wrap gap-3 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
								<span>{an.category}</span>
							</div>
						</div>
					</li>
				))}
			</ul>
			{processed.length === 0 && (
				<div className="text-sm text-muted-foreground italic">No announcements in this category yet.</div>
			)}
		</div>
	);
};

export default AnnouncementsList;

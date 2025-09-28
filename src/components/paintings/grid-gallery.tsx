"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";

export interface GridGalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
}

interface GridGalleryProps {
  items: GridGalleryItem[];
  /** Optional search query (already filtered externally). */
  className?: string;
  cardWidth?: number; // used only for sizing hint (width in tailwind not dynamic)
  cardHeight?: number;
  emptyState?: React.ReactNode;
}

/**
 * GridGallery
 * Simple responsive CSS grid version of the paintings gallery.
 * Designed to complement the draggable ScatteredGallery. No virtualization yet
 * (fine for a few hundred lightweight cards); can be enhanced later with windowing.
 */
export const GridGallery: React.FC<GridGalleryProps> = ({
  items,
  className,
  cardWidth = 260,
  cardHeight = 340,
  emptyState,
}) => {
  const content = useMemo(() => {
    if (!items.length)
      return (
        <div className="col-span-full flex flex-col items-center py-24 text-center text-sm text-muted-foreground">
          {emptyState || <p>No paintings found.</p>}
        </div>
      );
    return items.map((card) => (
      <div
        key={card.id}
        style={{ width: cardWidth, height: cardHeight }}
        className="group relative flex flex-col rounded-xl border border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 shadow-[4px_4px_0px_#000] ring-1 ring-black/10 dark:ring-white/10 overflow-hidden"
      >
        <div className="relative h-[70%] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={card.imageUrl}
            alt={card.title}
            fill
            sizes="260px"
            className="object-cover select-none pointer-events-none"
          />
        </div>
        <div className="p-3 h-[30%] flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base leading-snug line-clamp-2">{card.title}</h3>
            {card.subtitle && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{card.subtitle}</p>
            )}
          </div>
          
        </div>
      </div>
    ));
  }, [items, cardWidth, cardHeight, emptyState]);

  return (
    <div className={clsx("w-full", className)}>
      <div
        className="grid justify-center gap-6"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}px, 1fr))`,
        }}
      >
        {content}
      </div>
    </div>
  );
};

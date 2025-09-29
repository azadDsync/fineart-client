"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Painting } from "@/types/api";
import { LoadingSpinner } from "@/components/ui/loading";
import clsx from "clsx";

// Insert Cloudinary transformations for faster thumbnails when possible
function cloudinaryThumb(url: string, width = 800) {
  try {
    const u = new URL(url);
    if (u.hostname !== "res.cloudinary.com") return url;
    const parts = u.pathname.split("/");
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return url;
    // Insert transformation after 'upload'
    const tx = `f_auto,q_auto,w_${width},c_fit`;
    const before = parts.slice(0, uploadIdx + 1).join("/");
    const after = parts.slice(uploadIdx + 1).join("/");
    u.pathname = `${before}/${tx}/${after}`;
    return u.toString();
  } catch {
    return url;
  }
}

interface PaintingsGridInfiniteProps {
  pageSize?: number;
  className?: string;
  search?: string;
}

export const PaintingsGridInfinite: React.FC<PaintingsGridInfiniteProps> = ({ pageSize = 20, className, search }) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<ApiResponse<Painting[]>>({
    queryKey: ["paintings-infinite", { pageSize, search: search ?? "" }],
    queryFn: async ({ pageParam = 1 }) => apiClient.getPaintings({ page: pageParam as number, limit: pageSize, search }),
    getNextPageParam: (lastPage) => {
      const pg = lastPage.pagination;
      if (!pg) return undefined;
      return pg.page < pg.totalPages ? pg.page + 1 : undefined;
    },
    initialPageParam: 1,
    placeholderData: (prev) => prev,
  });

  const items = useMemo(() => (data?.pages ?? []).flatMap((p) => p.data), [data]);

  // Intersection observer for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    }, { rootMargin: "600px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Lightbox state
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const showPrev = useCallback(() => {
    setLightboxIdx((idx) => (idx === null ? null : (idx + items.length - 1) % items.length));
  }, [items.length]);
  const showNext = useCallback(() => {
    setLightboxIdx((idx) => (idx === null ? null : (idx + 1) % items.length));
  }, [items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, closeLightbox, showPrev, showNext]);

  return (
    <div className={clsx("w-full", className)}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading && items.length === 0 && (
          <div className="col-span-full flex items-center gap-2 text-sm text-muted-foreground"><LoadingSpinner /> Loading…</div>
        )}
        {error && items.length === 0 && (
          <div className="col-span-full rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">Failed to load paintings</div>
        )}

        {items.map((p, idx) => (
          <div key={p.id} className="group relative rounded-xl border  overflow-hidden border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 shadow-[8px_8px_0px_#000]">
            <button
              type="button"
              onClick={() => setLightboxIdx(idx)}
              className="flex flex-col h-full text-left w-full"
              aria-label={`Open ${p.title}`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={cloudinaryThumb(p.imageUrl, 900)}
                  alt={`${p.title}${p.user?.name ? ` by ${p.user.name}` : ""}`}
                  fill
                  loading="lazy"
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium text-sm leading-snug line-clamp-1">{p.title}</h3>
                {p.user?.name && <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{p.user.name}</p>}
                {p.description && (
                  <span className="mt-3 inline-block text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 line-clamp-1">{p.description}</span>
                )}
              </div>
            </button>
          </div>
        ))}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="col-span-full h-6" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        {isFetchingNextPage && <div className="flex items-center gap-2 text-sm text-muted-foreground"><LoadingSpinner /> Loading more…</div>}
        {!isLoading && !isFetchingNextPage && hasNextPage && (
          <button className="text-xs px-3 py-1.5 rounded-md border bg-background hover:bg-accent/10 transition" onClick={() => fetchNextPage()}>Load more</button>
        )}
        {error && items.length > 0 && (
          <button className="text-xs px-3 py-1.5 rounded-md border bg-background hover:bg-accent/10 transition" onClick={() => refetch()}>Retry</button>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && items[lightboxIdx] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <button aria-label="Close" onClick={closeLightbox} className="absolute top-4 right-4 text-white/80 hover:text-white text-xl">✕</button>
          <button aria-label="Previous" onClick={showPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-2xl">‹</button>
          <button aria-label="Next" onClick={showNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-2xl">›</button>
          <div className="relative w-[90vw] max-w-5xl aspect-[4/3]">
            <Image
              src={items[lightboxIdx].imageUrl}
              alt={`${items[lightboxIdx].title}${items[lightboxIdx].user?.name ? ` by ${items[lightboxIdx].user.name}` : ""}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 90vw, 1000px"
              priority
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white/90">
            <div className="text-sm font-medium">{items[lightboxIdx].title}</div>
            {items[lightboxIdx].user?.name && <div className="text-xs opacity-80">{items[lightboxIdx].user.name}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaintingsGridInfinite;

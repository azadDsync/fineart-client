"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import clsx from "clsx";
import { GridGallery } from "./grid-gallery";

/**
 * ScatteredGallery
 * A panning canvas that randomly scatters cards representing images/paintings.
 * - Renders a very large virtual canvas (default 4000x4000) inside a viewport that can be dragged.
 * - Only visible cards are actually mounted (basic culling) for perf.
 * - Deterministic random layout based on seed so layout stays stable across renders.
 */

export interface GalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  width?: number; // intrinsic image width (optional)
  height?: number; // intrinsic image height (optional)
}

interface ScatteredGalleryProps {
  items: GalleryItem[];
  /** Total virtual canvas size (square). */
  size?: number;
  /** Card base size */
  cardWidth?: number;
  cardHeight?: number;
  /** Constrain drag bounds with overscroll padding */
  overscroll?: number;
  /** Minimum pixel distance (center to center) we try to keep between cards (best effort) */
  minDistance?: number;
  /** Ensure at least this many cards start within initial viewport area (roughly centered) */
  initialVisible?: number;
  /** Recenters offset automatically to true canvas center on mount */
  autoCenter?: boolean;
  className?: string;
}

// Small seeded RNG so positions remain stable given same inputs.
function makeRng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    // xorshift32
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

export const ScatteredGallery: React.FC<ScatteredGalleryProps> = ({
  items,
  size = 4000,
  cardWidth = 260,
  cardHeight = 340,
  overscroll = 400,
  minDistance = 160,
  initialVisible = 12,
  autoCenter = true,
  className,
}) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const [mode, setMode] = useState<"scatter" | "grid">("grid");
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.subtitle?.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Precompute random layout
  const cardLayouts = useMemo(() => {
    const rng = makeRng(items.length * 999 + 17);
    const placed: { x: number; y: number }[] = [];
    const center = size / 2;
    const source = filteredItems;
    const results = source.map((item, idx) => {
      let x = 0,
        y = 0;
      const attempts = 40;
      if (idx < initialVisible) {
        // Bias into an expanded ellipse near center but not tightly overlapping.
        const radius = 500; // area radius for initial visible set
        const angle = rng() * Math.PI * 2;
        const r = Math.sqrt(rng()) * radius; // even distribution
        x = Math.floor(center + r * Math.cos(angle) - cardWidth / 2);
        y = Math.floor(center + r * Math.sin(angle) - cardHeight / 2);
      } else {
        // Uniform random across canvas
        for (let a = 0; a < attempts; a++) {
          const candidateX = Math.floor(rng() * (size - cardWidth));
          const candidateY = Math.floor(rng() * (size - cardHeight));
          // Check distance to existing placed (simple linear scan; fine for moderate counts)
          const ok = placed.every((p) => {
            const dx = p.x + cardWidth / 2 - (candidateX + cardWidth / 2);
            const dy = p.y + cardHeight / 2 - (candidateY + cardHeight / 2);
            return dx * dx + dy * dy >= minDistance * minDistance * 0.5; // allow some overlap -> 0.5 factor
          });
          if (ok) {
            x = candidateX;
            y = candidateY;
            break;
          }
          if (a === attempts - 1) {
            x = candidateX;
            y = candidateY;
          } // fallback
        }
      }
      placed.push({ x, y });
      const rotation = (rng() - 0.5) * 10; // slightly smaller tilt
      return { ...item, x, y, rotation };
    });
    return results;
  }, [
    filteredItems,
    items.length,
    size,
    cardWidth,
    cardHeight,
    minDistance,
    initialVisible,
  ]);

  // Center viewport on mount (after first render when we have viewport size)
  useEffect(() => {
    if (!autoCenter || !viewportRef.current) return;
    const vp = viewportRef.current.getBoundingClientRect();
    const x = -(size / 2 - vp.width / 2);
    const y = -(size / 2 - vp.height / 2);
    setOffset({ x, y });
  }, [autoCenter, size]);

  // Basic culling: compute which cards are near viewport.
  const visibleCards = useMemo(() => {
    if (!viewportRef.current) return cardLayouts;
    const vp = viewportRef.current.getBoundingClientRect();
    // Expand viewport rect a bit so cards slide in smoothly.
    const pad = 400;
    const view = {
      left: -offset.x - pad,
      top: -offset.y - pad,
      right: -offset.x + vp.width + pad,
      bottom: -offset.y + vp.height + pad,
    };
    return cardLayouts.filter(
      (c) =>
        c.x + cardWidth > view.left &&
        c.x < view.right &&
        c.y + cardHeight > view.top &&
        c.y < view.bottom
    );
  }, [cardLayouts, offset, cardWidth, cardHeight]);

  // Drag handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastPoint.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const clampOffset = useCallback(
    (x: number, y: number) => {
      const vp = viewportRef.current?.getBoundingClientRect();
      const maxX = 0 + overscroll;
      const maxY = 0 + overscroll;
      const minX = -(size - (vp?.width || 0)) - overscroll;
      const minY = -(size - (vp?.height || 0)) - overscroll;
      return {
        x: Math.min(maxX, Math.max(minX, x)),
        y: Math.min(maxY, Math.max(minY, y)),
      };
    },
    [overscroll, size]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPoint.current.x;
      const dy = e.clientY - lastPoint.current.y;
      lastPoint.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: dx, y: dy };
      setOffset((o) => clampOffset(o.x + dx, o.y + dy));
    },
    [clampOffset]
  );

  const endDrag = useCallback(() => {
    dragging.current = false;
  }, []);

  // Inertia (tiny)
  useEffect(() => {
    const step = () => {
      if (!dragging.current) {
        velocity.current.x *= 0.92;
        velocity.current.y *= 0.92;
        if (
          Math.abs(velocity.current.x) < 0.3 &&
          Math.abs(velocity.current.y) < 0.3
        ) {
          velocity.current = { x: 0, y: 0 };
        } else {
          setOffset((o) =>
            clampOffset(o.x + velocity.current.x, o.y + velocity.current.y)
          );
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [clampOffset]);

  // Prevent default browser image drag ghost
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const prevent = (e: DragEvent) => e.preventDefault();
    el.addEventListener("dragstart", prevent);
    return () => el.removeEventListener("dragstart", prevent);
  }, []);

  const isScatter = mode === "scatter";
  return (
    <div className={clsx("relative w-full", className)}>
      {/* Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <input
            type="text"
            placeholder="Search paintings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-xs rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setMode("scatter")}
            className={clsx(
              "rounded-md px-3 py-1.5 border text-xs font-medium",
              isScatter ? "bg-foreground text-background" : "bg-background"
            )}
          >
            Scatter
          </button>
          <button
            onClick={() => setMode("grid")}
            className={clsx(
              "rounded-md px-3 py-1.5 border text-xs font-medium",
              !isScatter ? "bg-foreground text-background" : "bg-background"
            )}
          >
            Grid
          </button>
        </div>
      </div>
      {isScatter ? (
        <div
          className={clsx(
            "relative h-[calc(100vh-11rem)] w-full overflow-hidden rounded-md border ",
            className
          )}
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <div
            ref={contentRef}
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
            }}
            className="absolute top-0 left-0 will-change-transform paper-bg"
          >
            <div style={{ width: size, height: size, position: "relative" }}>
              {visibleCards.map((card) => (
                <GalleryCard
                  key={card.id}
                  card={card}
                  width={cardWidth}
                  height={cardHeight}
                />
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4 text-xs text-muted-foreground">
            <span>Drag to explore</span>
            <span>
              {visibleCards.length} / {filteredItems.length} visible
            </span>
          </div>
        </div>
      ) : (
        <div className="min-h-[60vh]">
          <GridGallery items={filteredItems} />
        </div>
      )}
    </div>
  );
};

interface CardProps {
  card: ReturnType<typeof Object.assign> & {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
    x: number;
    y: number;
    rotation: number;
  };
  width: number;
  height: number;
}
export const GalleryCard: React.FC<CardProps> = ({ card, width, height }) => {
  return (
    <div
      style={{
        width,
        height,
        position: "absolute",
        left: card.x,
        top: card.y,
        transform: `rotate(${card.rotation}deg)`,
      }}
      className="group rounded-xl border-black shadow-[8px_8px_0px_#000]  bg-neutral-50 dark:bg-neutral-900  ring-1 ring-black/10 dark:ring-white/10  border dark:border-neutral-700/40"
    >
      <div className="relative h-[70%] w-full overflow-hidden rounded-t-xl bg-neutral-100 dark:bg-neutral-800">
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
          <h3 className="font-serif text-base leading-snug line-clamp-2">
            {card.title}
          </h3>
          {card.subtitle && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {card.subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

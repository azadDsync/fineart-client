"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Event, Announcement, Painting } from "@/types/api";
import { Calendar, Megaphone, ArrowRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const shortDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
};

const timeStr = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const formatTimeRange = (startIso?: string, endIso?: string) => {
  if (!startIso) return null;
  const s = new Date(startIso);
  if (s.toString() === "Invalid Date") return null;
  if (!endIso) return timeStr(startIso);
  const e = new Date(endIso);
  if (e.toString() === "Invalid Date") return timeStr(startIso);
  const startTime = timeStr(startIso);
  const endTime = timeStr(endIso);
  if (sameDay(s, e)) return `${startTime} – ${endTime}`;
  return `${startTime} – ${shortDate(endIso)} ${endTime}`;
};

export default function Landing() {
  // Data queries for landing
  const { data: eventsRes, isLoading: eventsLoading, error: eventsError } = useQuery<ApiResponse<Event[]>>({
    queryKey: ["landing-events"],
    queryFn: () => apiClient.getUpcomingEvents({ page: 1, limit: 5 }),
    placeholderData: (prev) => prev,
  });

  // Fallback: if no upcoming events, fetch recent events to show activity
  const upcoming = eventsRes?.data ?? [];
  const {
    data: recentEventsRes,
    isLoading: recentEventsLoading,
    error: recentEventsError,
  } = useQuery<ApiResponse<Event[]>>({
    queryKey: ["landing-events-recent"],
    queryFn: () => apiClient.getEvents({ page: 1, limit: 5 }),
    enabled: !eventsLoading && upcoming.length === 0,
    placeholderData: (prev) => prev,
  });

  const { data: announcementsRes, isLoading: announcementsLoading, error: announcementsError } = useQuery<ApiResponse<Announcement[]>>({
    queryKey: ["landing-announcements"],
    queryFn: () => apiClient.getAnnouncements({ page: 1, limit: 3 }),
    placeholderData: (prev) => prev,
  });

  const { data: paintingsRes, isLoading: paintingsLoading, error: paintingsError } = useQuery<ApiResponse<Painting[]>>({
    queryKey: ["landing-paintings"],
    queryFn: () => apiClient.getPaintings({ page: 1, limit: 4 }),
    placeholderData: (prev) => prev,
  });

  const events = upcoming.length ? upcoming : (recentEventsRes?.data ?? []);
  const announcements = announcementsRes?.data ?? [];
  const paintings = paintingsRes?.data ?? [];
  return (
    <div className="relative">
      {/* Hero Section with notebook feel */}
      <section className="relative">
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <div className="text-center">
            <div className="eyebrow inline-flex items-center gap-2 rounded-full px-3 py-1 bg-accent/15 text-accent-foreground">
              The FineArt & Modeling Club
            </div>
            <h1 className="heading-display display-hero tracking-tight mt-5">
              Give your arts a <span className="highlight-rose">glow up</span>. Meet your new
              <span className="highlight-mint"> creative </span>family.
            </h1>
            <p className="mt-6 lead text-muted-foreground max-w-3xl mx-auto">
              Capture, organize, and elevate your ideas across work, life, and leisure.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4 ">
              {/* <Button asChild size="lg" variant="outline" className="border-black shadow-[8px_8px_0px_#000]">
                <Link href="/paintings">
                  Explore Gallery <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button> */}
              <Button asChild size="lg" variant="outline" className="border-black shadow-[8px_8px_0px_#000] panel-fill ">
                <Link href="/sign-up">Join the Club  <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View: Upcoming Events & Latest Announcements */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-16 lg:flex-row">
            {/* Events Preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-display text-2xl sm:text-3xl font-semibold flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15"><Calendar className="h-5 w-5 text-accent-foreground" /></span>
                  Upcoming Events
                </h2>

                  <Link href="/events" className="underline font-bold">View all</Link>
              </div>
              {eventsLoading || (!upcoming.length && recentEventsLoading) ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><LoadingSpinner /> Loading…</div>
              ) : eventsError && (!recentEventsRes || recentEventsError) ? (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">Failed to load events</div>
              ) : (
                <ul className="space-y-4">
                  {events.slice(0,4).map(ev => (
                    <li key={ev.id} className="group rounded-xl border p-4 hover:bg-[#FFD6BA] transition relative overflow-hidden border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-base leading-snug flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent/20 tracking-wide">{shortDate(ev.startDate)}</span>
                            {formatTimeRange(ev.startDate, ev.endDate) && (
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 tracking-wide">
                                {formatTimeRange(ev.startDate, ev.endDate)}
                              </span>
                            )}
                            {ev.title}
                          </h3>
                          {ev.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{ev.description}</p>}
                        </div>
                        <div className="text-right">
                          {ev.location && <span className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{ev.location}</span>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Announcements Preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-display text-2xl sm:text-3xl font-semibold flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15"><Megaphone className="h-5 w-5 text-accent-foreground" /></span>
                  Latest Announcements
                </h2>
                <Link href="/announcements" className="underline font-bold">View all</Link>
              </div>
              {announcementsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><LoadingSpinner /> Loading…</div>
              ) : announcementsError ? (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">Failed to load announcements</div>
              ) : (
                <ul className="space-y-4">
                  {announcements.slice(0,3).map(an => (
                    <li key={an.id} className="group rounded-xl border p-4 hover:bg-[#FFD6BA] transition border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 ">
                      <h3 className="font-medium text-base leading-snug flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent/20 tracking-wide">{shortDate(an.createdAt)}</span>
                        {an.title}
                      </h3>
                      {an.message && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{an.message}</p>}
                      {/* <div className="mt-2 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                        <span>{an.author?.name ?? "Announcement"}</span>
                        <span>{shortDate(an.createdAt)}</span>
                      </div> */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View: Top Paintings Gallery */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-display text-2xl sm:text-3xl font-semibold flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15"><ImageIcon className="h-5 w-5 text-accent-foreground" /></span>
              Top Paintings
            </h2>
            <Link href="/paintings" className="underline font-bold">View all</Link>
          </div>
          {paintingsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><LoadingSpinner /> Loading…</div>
          ) : paintingsError ? (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">Failed to load paintings</div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {paintings.slice(0,4).map(p => (
                <li key={p.id} className="group relative rounded-xl border  overflow-hidden border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 shadow-[8px_8px_0px_#000]" >
                  <Link href="/paintings" className="flex flex-col h-full">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <Image
                        src={p.imageUrl}
                        alt={`${p.title}${p.user?.name ? ` by ${p.user.name}` : ""}`}
                        fill
                        className="object-contain p-4 group-hover:scale-105 "
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-medium text-sm leading-snug line-clamp-1">{p.title}</h3>
                      {p.user?.name && <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{p.user.name}</p>}
                      {p.description && <span className="mt-3 inline-block text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 line-clamp-1">{p.description}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

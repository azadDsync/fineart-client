
import { Button } from "@/components/ui/button";

import { Calendar, Megaphone, ArrowRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Temporary mock data (replace with API fetch later)
interface EventItem { id: string; title: string; date: string; description: string; location: string; }
interface AnnouncementItem { id: string; title: string; summary: string; category: string; date: string; }
interface PaintingItem { id: string; title: string; artist: string; medium: string; thumbnail: string; }

const mockEvents: EventItem[] = [
  { id: "e1", title: "Figure Study Workshop", date: "Sep 28", description: "Hands-on session focusing on gesture & proportion with live model guidance.", location: "Studio A" },
  { id: "e2", title: "Ink & Wash Techniques", date: "Oct 02", description: "Explore tonal layering and atmosphere using minimal palettes.", location: "Room 3" },
  { id: "e3", title: "Urban Sketch Walk", date: "Oct 06", description: "On-location sketching to capture spontaneous scenes and light.", location: "Old Town" },
  { id: "e4", title: "Portfolio Review Night", date: "Oct 11", description: "Peer + mentor critique focusing on narrative cohesion and presentation.", location: "Gallery Hall" },
  { id: "e5", title: "Mixed Media Collage Lab", date: "Oct 15", description: "Experiment with texture integration across paper, fabric & found material.", location: "Workshop Loft" },
];

const mockAnnouncements: AnnouncementItem[] = [
  { id: "a1", title: "Submissions Open: Autumn Showcase", summary: "Submit up to 3 pieces exploring transition, decay, or renewal themes.", category: "Call", date: "Sep 19" },
  { id: "a2", title: "New Residency Partnership", summary: "We’ve partnered with Atelier Nord for a month-long winter residency.", category: "Opportunity", date: "Sep 18" },
  { id: "a3", title: "Mentor Slot Signups", summary: "One-on-one critique sessions now available with visiting illustrators.", category: "Program", date: "Sep 17" },
  { id: "a4", title: "Print Lab Upgrades", summary: "Enhanced archival pigment printer + textured paper stocks added.", category: "Facilities", date: "Sep 14" },
  { id: "a5", title: "Volunteer Docent Crew", summary: "Help host the upcoming public open studios & earn exhibition credits.", category: "Community", date: "Sep 13" },
];

// Temporary mock paintings (replace with API fetch later)
const mockPaintings: PaintingItem[] = [
  { id: "p1", title: "Nocturne in Indigo", artist: "A. Khan", medium: "Oil on Panel", thumbnail: "/next.svg" },
  { id: "p2", title: "Urban Morning Haze", artist: "L. Duarte", medium: "Gouache", thumbnail: "/vercel.svg" },
  { id: "p3", title: "Fragments of Stillness", artist: "M. Sato", medium: "Mixed Media", thumbnail: "/window.svg" },
  { id: "p4", title: "Echoes of Glass", artist: "R. Patel", medium: "Acrylic", thumbnail: "/globe.svg" },
];

export default function Landing() {
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
                <Button asChild size="sm" variant="outline" className="border-black shadow-[4px_4px_0px_#000] panel-fill">
                  <Link href="/events">View all</Link>
                </Button>
              </div>
              <ul className="space-y-4">
                {mockEvents.slice(0,4).map(ev => (
                  <li key={ev.id} className="group rounded-xl border p-4 hover:bg-[#FFD6BA] transition  relative overflow-hidden border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 ">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-base leading-snug flex items-center gap-2">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/20">{ev.date}</span>
                          {ev.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{ev.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{ev.location}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Announcements Preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-display text-2xl sm:text-3xl font-semibold flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15"><Megaphone className="h-5 w-5 text-accent-foreground" /></span>
                  Latest Announcements
                </h2>
                <Button asChild size="sm" variant="outline" className="border-black shadow-[4px_4px_0px_#000] panel-fill">
                  <Link href="/announcements">View all</Link>
                </Button>
              </div>
              <ul className="space-y-4">
                {mockAnnouncements.slice(0,3).map(an => (
                  <li key={an.id} className="group rounded-xl border p-4 hover:bg-[#FFD6BA] transition border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 ">
                    <h3 className="font-medium text-base leading-snug">{an.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{an.summary}</p>
                    <div className="mt-2 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                      <span>{an.category}</span>
                      <span>{an.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
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
            <Button asChild size="sm" variant="outline" className="border-black shadow-[4px_4px_0px_#000] panel-fill">
              <Link href="/paintings">View all</Link>
            </Button>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockPaintings.slice(0,4).map(p => (
              <li key={p.id} className="group relative rounded-xl border  overflow-hidden border-black dark:border-neutral-700/40 bg-neutral-50 dark:bg-neutral-900 shadow-[4px_4px_0px_#000]" >
                <Link href="/paintings" className="flex flex-col h-full">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={p.thumbnail}
                      alt={`${p.title} by ${p.artist}`}
                      fill
                      className="object-contain p-4 group-hover:scale-105 "
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium text-sm leading-snug line-clamp-1">{p.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{p.artist}</p>
                    <span className="mt-3 inline-block text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{p.medium}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

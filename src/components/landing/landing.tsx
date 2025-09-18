
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Palette, Calendar, Megaphone, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

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

      {/* Features Section with sticker cards */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="heading-display text-3xl sm:text-5xl font-semibold">
              Turn midnight musings into morning action plans
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From showcasing your work to connecting with fellow artists
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="sticker rotate-[-1.5deg] text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15">
                  <Palette className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="heading-display">Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Exhibit your artwork and discover pieces from a global community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="sticker rotate-[0.75deg] text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15">
                  <Calendar className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="heading-display">Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Workshops, exhibitions, and critiques to grow your practice.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="sticker rotate-[-0.5deg] text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15">
                  <Megaphone className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="heading-display">Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  News, opportunities, and calls for submissions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="sticker rotate-[1.25deg] text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="heading-display">Alumni Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with artists charting their unique paths.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

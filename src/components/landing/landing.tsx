
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome to FineArt Club
            </h1>
            <p className="mt-6 text-xl leading-8 text-purple-100">
              Discover, create, and showcase amazing artwork with our vibrant
              community of artists and enthusiasts.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" variant="secondary">
                <Link href="/paintings">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-purple-600"
              >
                <Link href="/sign-up">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Everything you need for your artistic journey
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              From showcasing your work to connecting with fellow artists
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Showcase your artwork and discover amazing pieces from
                  talented artists in our community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join workshops, exhibitions, and networking events to grow
                  your skills and connect with others.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Megaphone className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Stay updated with the latest news, opportunities, and
                  announcements from the art community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Alumni Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with alumni artists who have made their mark in the
                  industry and learn from their experiences.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
    </div>
  );
}

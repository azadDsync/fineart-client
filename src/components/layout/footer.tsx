import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Please enter an email");
    toast.success("Subscribed — thanks!");
    setEmail("");
  }

  return (
    <footer className="bg-background border-t border-border text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="h-10 w-10 rounded-md flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="FineArt & Modeling Club Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-semibold">FineArt</div>
                <div className="text-sm text-muted-foreground">
                  FineArt & Modeling Club
                </div>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              A small community for artists to share work, find events, and grow
              together.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex gap-8">
            <div>
              <h4 className="text-sm font-medium">Explore</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/paintings"
                    className="hover:text-accent-foreground"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-accent-foreground">
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/announcements"
                    className="hover:text-accent-foreground"
                  >
                    Announcements
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium">Community</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/alumni" className="hover:text-accent-foreground">
                    Alumni
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="hover:text-accent-foreground"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="hover:text-accent-foreground"
                  >
                    Join
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div>
            <h4 className="text-sm font-medium">Stay in the loop</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign up for event updates, calls for submissions, and community
              news.
            </p>
            <form onSubmit={submit} className="mt-4 flex gap-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email"
                className="flex-1"
              />
              <Button type="submit" variant="secondary">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <div>
            © {new Date().getFullYear()} FineArt & Modeling Club. All rights
            reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-accent-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-accent-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

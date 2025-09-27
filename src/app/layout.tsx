import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Artistic high-contrast serif for expressive headings
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Accent grotesk for numbers/labels
const accent = Space_Grotesk({
  variable: "--font-accent",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FineArt & Modeling Club",
  description: "Discover and showcase amazing artwork from talented artists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${accent.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <AppLayout>{children}</AppLayout>
            </QueryProvider>
          </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

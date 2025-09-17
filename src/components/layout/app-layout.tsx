'use client';

import { ReactNode } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Toaster } from 'sonner';
import Footer from './footer';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ErrorBoundary>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </ErrorBoundary>
    </div>
  );
}
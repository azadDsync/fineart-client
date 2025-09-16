'use client';

import { useEffect, ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const session = await authClient.getSession();
        
        if (session?.data?.user) {
          // Map Better Auth user to our User type
          const user = {
            id: session.data.user.id,
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image || undefined,
            role: 'MEMBER' as const, // Default role, will be updated from API if needed
            isStale: false, // Default value, will be updated from API if needed
            createdAt: session.data.user.createdAt.toISOString(),
            updatedAt: session.data.user.updatedAt.toISOString(),
          };
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Check session periodically
    const interval = setInterval(checkSession, 5 * 60 * 1000); 
    return () => {
      clearInterval(interval);
    };
  }, [setUser, setLoading, router]);

  return <>{children}</>;
}
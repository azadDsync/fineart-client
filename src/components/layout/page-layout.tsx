import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  title,
  description,
  actions,
  className
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {(title || description || actions) && (
          <div className="mb-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
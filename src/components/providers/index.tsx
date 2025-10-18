// 'use client';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { ThemeProvider as NextThemeProvider } from 'next-themes';
// import { Toaster } from 'sonner';
// import { useState } from 'react';

// export function Providers({ children }: { children: React.ReactNode }) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 60 * 1000, // 1 minute
//             retry: (failureCount, error: unknown) => {
//               // Don't retry on 401/403 errors
//               if (error && typeof error === 'object' && 'status' in error) {
//                 const errorStatus = (error as { status: number }).status;
//                 if (errorStatus === 401 || errorStatus === 403) {
//                   return false;
//                 }
//               }
//               return failureCount < 3;
//             },
//           },
//         },
//       })
//   );

//   return (
//     <QueryClientProvider client={queryClient}>
//       <NextThemeProvider
//         attribute="class"
//         defaultTheme="system"
//         enableSystem
//         disableTransitionOnChange
//       >
//         {children}
//         <Toaster position="top-right" />
//       </NextThemeProvider>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }

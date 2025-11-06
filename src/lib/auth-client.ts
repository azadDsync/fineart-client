import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Use production URL if NEXT_PUBLIC_API_URL is not set (for deployed environments)
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In production (deployed), use production API URL
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If accessing from production domain, use production API
    if (hostname === 'fa.nitkkr.page' || hostname === 'finearts-club.vercel.app') {
      return 'https://fa-api.nitkkr.page';
    }
  }
  // Development fallback
  return "http://localhost:8787";
};

const baseURL = getBaseUrl();

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          input: false,
        },
        isStale: {
          type: "boolean",
          input: false,
        },
      },
    }),
  ],
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
});

export type AuthClient = typeof authClient;

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Prefer explicit env variable, fallback to localhost dev server
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields({
      user: {
        role: {
          type: "string",
          input:false
        },
        isStale: {
          type: "boolean",
          input:false

        }
      }
  })],
  baseURL,
  fetchOptions: {
    credentials: 'include',
  },
});

export type AuthClient = typeof authClient;

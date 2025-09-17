import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Prefer explicit env variable, fallback to localhost dev server
const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8787";

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
});

export type AuthClient = typeof authClient;

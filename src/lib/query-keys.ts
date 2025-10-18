/**
 * Centralized query keys factory for React Query
 * This ensures consistent cache management across the application
 */

import type {
  PaginationParams,
  SearchAlumniParams,
  SearchPaintingsParams,
  SearchUsersParams,
} from "@/types/api";

export const queryKeys = {
  // Auth
  auth: {
    session: () => ["session"] as const,
    user: () => ["current-user"] as const,
  },

  // Paintings
  paintings: {
    all: () => ["paintings"] as const,
    lists: () => [...queryKeys.paintings.all(), "list"] as const,
    list: (params: SearchPaintingsParams) =>
      [...queryKeys.paintings.lists(), params] as const,
    infinite: (params: SearchPaintingsParams) =>
      [...queryKeys.paintings.all(), "infinite", params] as const,
    my: (params?: PaginationParams) =>
      [...queryKeys.paintings.all(), "my", params ?? {}] as const,
    detail: (id: string) =>
      [...queryKeys.paintings.all(), "detail", id] as const,
  },

  // Events
  events: {
    all: () => ["events"] as const,
    lists: () => [...queryKeys.events.all(), "list"] as const,
    list: (params?: PaginationParams) =>
      [...queryKeys.events.lists(), params ?? {}] as const,
    upcoming: (params?: PaginationParams) =>
      [...queryKeys.events.all(), "upcoming", params ?? {}] as const,
    my: (params?: PaginationParams) =>
      [...queryKeys.events.all(), "my", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.events.all(), "detail", id] as const,
    attendees: (id: string, params?: PaginationParams) =>
      [...queryKeys.events.detail(id), "attendees", params ?? {}] as const,
  },

  // Announcements
  announcements: {
    all: () => ["announcements"] as const,
    lists: () => [...queryKeys.announcements.all(), "list"] as const,
    list: (params?: PaginationParams) =>
      [...queryKeys.announcements.lists(), params ?? {}] as const,
    my: (params?: PaginationParams) =>
      [...queryKeys.announcements.all(), "my", params ?? {}] as const,
    detail: (id: string) =>
      [...queryKeys.announcements.all(), "detail", id] as const,
  },

  // Alumni
  alumni: {
    all: () => ["alumni"] as const,
    lists: () => [...queryKeys.alumni.all(), "list"] as const,
    list: (params?: SearchAlumniParams) =>
      [...queryKeys.alumni.lists(), params ?? {}] as const,
    batch: (year: number, params?: PaginationParams) =>
      [...queryKeys.alumni.all(), "batch", year, params ?? {}] as const,
    detail: (id: string) => [...queryKeys.alumni.all(), "detail", id] as const,
    stats: () => [...queryKeys.alumni.all(), "stats"] as const,
  },

  // Admin
  admin: {
    all: () => ["admin"] as const,
    stats: () => [...queryKeys.admin.all(), "stats"] as const,
    users: {
      all: () => [...queryKeys.admin.all(), "users"] as const,
      lists: () => [...queryKeys.admin.users.all(), "list"] as const,
      list: (params?: SearchUsersParams) =>
        [...queryKeys.admin.users.lists(), params ?? {}] as const,
      detail: (id: string) =>
        [...queryKeys.admin.users.all(), "detail", id] as const,
    },
  },
} as const;

/**
 * Custom React Query hooks for API operations
 * Provides optimized, reusable hooks for all API endpoints
 */

"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type {
  ApiResponse,
  Painting,
  Event,
  Announcement,
  Alumni,
  User,
  AdminStats,
  UserStats,
  CreatePaintingData,
  UpdatePaintingData,
  CreateEventData,
  UpdateEventData,
  CreateAnnouncementData,
  UpdateAnnouncementData,
  CreateAlumniData,
  UpdateAlumniData,
  UpdateUserStatusData,
  BulkUserActionData,
  PaginationParams,
  SearchUsersParams,
  SearchAlumniParams,
  SearchPaintingsParams,
  EventAttendee,
  AlumniStatsData,
} from "@/types/api";

// ============================================================================
// PAINTINGS HOOKS
// ============================================================================

export function usePaintings(
  params: SearchPaintingsParams = {},
  options?: Omit<
    UseQueryOptions<ApiResponse<Painting[]>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.paintings.list(params),
    queryFn: () => apiClient.getPaintings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function usePaintingsInfinite(
  params: SearchPaintingsParams = {},
  pageSize = 20
) {
  return useInfiniteQuery({
    queryKey: queryKeys.paintings.infinite({ ...params, limit: pageSize }),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getPaintings({
        ...params,
        page: pageParam as number,
        limit: pageSize,
      }),
    getNextPageParam: (lastPage) => {
      const pg = lastPage.pagination;
      if (!pg) return undefined;
      return pg.page < pg.totalPages ? pg.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useMyPaintings(
  params: PaginationParams = {},
  options?: Omit<
    UseQueryOptions<ApiResponse<Painting[]>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.paintings.my(params),
    queryFn: () => apiClient.getMyPaintings(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function usePainting(
  id: string,
  options?: Omit<UseQueryOptions<ApiResponse<Painting>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.paintings.detail(id),
    queryFn: () => apiClient.getPainting(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useCreatePainting(
  onSuccessCallback?: (data: ApiResponse<Painting>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePaintingData) => apiClient.createPainting(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paintings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paintings.my() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.paintings.infinite({}),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdatePainting(
  onSuccessCallback?: (data: ApiResponse<Painting>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaintingData }) =>
      apiClient.updatePainting(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.paintings.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.paintings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paintings.my() });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeletePainting(
  onSuccessCallback?: (data: ApiResponse<{ message: string }>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deletePainting(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paintings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paintings.my() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.paintings.infinite({}),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      onSuccessCallback?.(data);
    },
  });
}

// ============================================================================
// EVENTS HOOKS
// ============================================================================

export function useEvents(
  params: PaginationParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<Event[]>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: () => apiClient.getEvents(params),
    staleTime: 3 * 60 * 1000,
    ...options,
  });
}

export function useUpcomingEvents(
  params: PaginationParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<Event[]>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.events.upcoming(params),
    queryFn: () => apiClient.getUpcomingEvents(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useMyEvents(
  params: PaginationParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<Event[]>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.events.my(params),
    queryFn: () => apiClient.getMyEvents(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useEvent(
  id: string,
  options?: Omit<UseQueryOptions<ApiResponse<Event>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => apiClient.getEvent(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
    ...options,
  });
}

export function useEventAttendees(
  id: string,
  params: PaginationParams = {},
  options?: Omit<
    UseQueryOptions<ApiResponse<EventAttendee[]>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.events.attendees(id, params),
    queryFn: () => apiClient.getEventAttendees(id, params),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useCreateEvent(
  onSuccessCallback?: (data: ApiResponse<Event>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventData) => apiClient.createEvent(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.upcoming() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateEvent(
  onSuccessCallback?: (data: ApiResponse<Event>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
      apiClient.updateEvent(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.upcoming() });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteEvent(
  onSuccessCallback?: (data: ApiResponse<{ message: string }>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteEvent(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.upcoming() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      onSuccessCallback?.(data);
    },
  });
}

export function useJoinEvent(
  onSuccessCallback?: (data: ApiResponse<{ message: string }>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.joinEvent(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.detail(variables),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.my() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.attendees(variables),
      });
      onSuccessCallback?.(data);
    },
  });
}

export function useLeaveEvent(
  onSuccessCallback?: (data: ApiResponse<{ message: string }>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.leaveEvent(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.detail(variables),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.my() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.attendees(variables),
      });
      onSuccessCallback?.(data);
    },
  });
}

// ============================================================================
// ANNOUNCEMENTS HOOKS
// ============================================================================

export function useAnnouncements(
  params: PaginationParams = {},
  options?: Omit<
    UseQueryOptions<ApiResponse<Announcement[]>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.announcements.list(params),
    queryFn: () => apiClient.getAnnouncements(params),
    staleTime: 3 * 60 * 1000,
    ...options,
  });
}

export function useMyAnnouncements(
  params: PaginationParams = {},
  options?: Omit<
    UseQueryOptions<ApiResponse<Announcement[]>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.announcements.my(params),
    queryFn: () => apiClient.getMyAnnouncements(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useAnnouncement(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<Announcement>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.announcements.detail(id),
    queryFn: () => apiClient.getAnnouncement(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
    ...options,
  });
}

export function useCreateAnnouncement(
  onSuccessCallback?: (data: ApiResponse<Announcement>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAnnouncementData) =>
      apiClient.createAnnouncement(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.lists(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.my() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateAnnouncement(
  onSuccessCallback?: (data: ApiResponse<Announcement>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAnnouncementData }) =>
      apiClient.updateAnnouncement(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.lists(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.my() });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteAnnouncement(
  onSuccessCallback?: (data: ApiResponse<{ message: string }>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteAnnouncement(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.lists(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.my() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      onSuccessCallback?.(data);
    },
  });
}

// ============================================================================
// ALUMNI HOOKS
// ============================================================================

export function useAlumni(
  params: SearchAlumniParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<Alumni[]>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.alumni.list(params),
    queryFn: () => apiClient.getAlumni(params),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useAlumniBatch(
  year: number,
  params: PaginationParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<Alumni[]>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.alumni.batch(year, params),
    queryFn: () => apiClient.getAlumniByBatch(year, params),
    enabled: !!year,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useAlumniRecord(
  id: string,
  options?: Omit<UseQueryOptions<ApiResponse<Alumni>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.alumni.detail(id),
    queryFn: () => apiClient.getAlumniRecord(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useAlumniStats(
  options?: Omit<
    UseQueryOptions<ApiResponse<AlumniStatsData>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.alumni.stats(),
    queryFn: () => apiClient.getAlumniStats(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useCreateAlumni(
  onSuccessCallback?: (data: ApiResponse<Alumni>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAlumniData) => apiClient.createAlumni(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alumni.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.alumni.stats() });
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateAlumni(
  onSuccessCallback?: (data: ApiResponse<Alumni>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAlumniData }) =>
      apiClient.updateAlumni(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.alumni.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.alumni.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.alumni.stats() });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteAlumni(
  onSuccessCallback?: (data: ApiResponse<{ message: string }>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteAlumni(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alumni.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.alumni.stats() });
      onSuccessCallback?.(data);
    },
  });
}

// ============================================================================
// ADMIN HOOKS
// ============================================================================

export function useAdminStats(
  options?: Omit<
    UseQueryOptions<ApiResponse<AdminStats>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: () => apiClient.getAdminStats(),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useUsers(
  params: SearchUsersParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<User[]>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.admin.users.list(params),
    queryFn: () => apiClient.getUsers(params),
    staleTime: 3 * 60 * 1000,
    ...options,
  });
}

export function useUser(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<User & { stats: UserStats }>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.admin.users.detail(id),
    queryFn: () => apiClient.getUser(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
    ...options,
  });
}

export function useUpdateUserStatus(
  onSuccessCallback?: (data: ApiResponse<User & { message: string }>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserStatusData }) =>
      apiClient.updateUserStatus(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users.lists(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteUser(
  onSuccessCallback?: (data: ApiResponse<{ message: string }>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteUser(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users.lists(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      onSuccessCallback?.(data);
    },
  });
}

export function useBulkUserAction(
  onSuccessCallback?: (data: ApiResponse<User[] & { message: string }>) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkUserActionData) => apiClient.bulkUserAction(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users.lists(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      onSuccessCallback?.(data);
    },
  });
}

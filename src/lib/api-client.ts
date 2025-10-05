import type {
  ApiResponse,
  ApiError,
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
  AlumniStatsData
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // We rely on HTTP-only cookies set by Better Auth; no need to fetch session here.
    // (Intentionally avoiding authClient.getSession() in client-side code.)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Better Auth uses cookies for authentication, so we don't need to manually set tokens

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      type MaybeErr = Partial<ApiError> & { message?: string };
      let parsed: MaybeErr = { error: 'Network error', status: response.status };
      try {
        parsed = await response.json();
      } catch {
        // keep default parsed
      }
      const message = typeof parsed.error === 'string'
        ? parsed.error
        : (typeof parsed.message === 'string' ? parsed.message : 'Request failed');
      const err = new Error(message) as Error & { status?: number; code?: string };
      err.status = parsed.status ?? response.status;
      err.code = parsed.code;
      throw err;
    }

    return response.json();
  }

  private buildQueryString(
    params: PaginationParams | SearchUsersParams | SearchAlumniParams | Record<string, unknown>
  ): string {
    const filteredParams = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    
    return filteredParams ? `?${filteredParams}` : '';
  }

  // Paintings API
  async getPaintings(params: SearchPaintingsParams = {}): Promise<ApiResponse<Painting[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/paintings${queryString}`);
  }

  async getMyPaintings(params: PaginationParams = {}): Promise<ApiResponse<Painting[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/paintings/my${queryString}`);
  }

  async getPainting(id: string): Promise<ApiResponse<Painting>> {
    return this.request(`/paintings/${id}`);
  }

  async createPainting(data: CreatePaintingData): Promise<ApiResponse<Painting>> {
    return this.request('/paintings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePainting(id: string, data: UpdatePaintingData): Promise<ApiResponse<Painting>> {
    return this.request(`/paintings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePainting(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/paintings/${id}`, {
      method: 'DELETE',
    });
  }

  // Events API
  async getEvents(params: PaginationParams = {}): Promise<ApiResponse<Event[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/events${queryString}`);
  }

  async getUpcomingEvents(params: PaginationParams = {}): Promise<ApiResponse<Event[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/events/upcoming${queryString}`);
  }

  async getMyEvents(params: PaginationParams = {}): Promise<ApiResponse<Event[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/events/my${queryString}`);
  }

  async getEvent(id: string): Promise<ApiResponse<Event>> {
    return this.request(`/events/${id}`);
  }

  async createEvent(data: CreateEventData): Promise<ApiResponse<Event>> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: UpdateEventData): Promise<ApiResponse<Event>> {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async joinEvent(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/events/${id}/join`, {
      method: 'POST',
    });
  }

  async leaveEvent(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/events/${id}/leave`, {
      method: 'DELETE',
    });
  }

  async getEventAttendees(id: string, params: PaginationParams = {}): Promise<ApiResponse<EventAttendee[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/events/${id}/attendees${queryString}`);
  }

  // Announcements API
  async getAnnouncements(params: PaginationParams = {}): Promise<ApiResponse<Announcement[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/announcements${queryString}`);
  }

  async getMyAnnouncements(params: PaginationParams = {}): Promise<ApiResponse<Announcement[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/announcements/my${queryString}`);
  }

  async getAnnouncement(id: string): Promise<ApiResponse<Announcement>> {
    return this.request(`/announcements/${id}`);
  }

  async createAnnouncement(data: CreateAnnouncementData): Promise<ApiResponse<Announcement>> {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAnnouncement(id: string, data: UpdateAnnouncementData): Promise<ApiResponse<Announcement>> {
    return this.request(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAnnouncement(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/announcements/${id}`, {
      method: 'DELETE',
    });
  }

  // Alumni API
  async getAlumni(params: SearchAlumniParams = {}): Promise<ApiResponse<Alumni[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/alumni${queryString}`);
  }

  async getAlumniByBatch(year: number, params: PaginationParams = {}): Promise<ApiResponse<Alumni[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/alumni/batch/${year}${queryString}`);
  }

  async getAlumniRecord(id: string): Promise<ApiResponse<Alumni>> {
    return this.request(`/alumni/${id}`);
  }

  async createAlumni(data: CreateAlumniData): Promise<ApiResponse<Alumni>> {
    return this.request('/alumni', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAlumni(id: string, data: UpdateAlumniData): Promise<ApiResponse<Alumni>> {
    return this.request(`/alumni/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAlumni(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/alumni/${id}`, {
      method: 'DELETE',
    });
  }

  async getAlumniStats(): Promise<ApiResponse<AlumniStatsData>> {
    return this.request('/alumni/stats/overview');
  }

  // Admin API
  async getUsers(params: SearchUsersParams = {}): Promise<ApiResponse<User[]>> {
    const queryString = this.buildQueryString(params);
    return this.request(`/admin/users${queryString}`);
  }

  async getUser(id: string): Promise<ApiResponse<User & { stats: UserStats }>> {
    return this.request(`/admin/users/${id}`);
  }

  async updateUserStatus(id: string, data: UpdateUserStatusData): Promise<ApiResponse<User & { message: string }>> {
    return this.request(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return this.request('/admin/stats');
  }

  async bulkUserAction(data: BulkUserActionData): Promise<ApiResponse<User[] & { message: string }>> {
    return this.request('/admin/users/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return fetch(`${API_BASE_URL.replace('/api', '')}/health`).then(res => res.json());
  }
}

export const apiClient = new ApiClient();
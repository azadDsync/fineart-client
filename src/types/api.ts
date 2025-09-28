// Base types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'MEMBER' | 'ADMIN';
  isStale: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Painting {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, 'id' | 'name' | 'image'>;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  organizerId: string;
  createdAt: string;
  organizer?: Pick<User, 'id' | 'name' | 'image'>;
  attendeesCount?: number;
  isAttending?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: Pick<User, 'id' | 'name' | 'image'>;
}

export interface Alumni {
  id: string;
  name: string;
  email?: string;
  batchYear?: number;
  details?: string;
  imageUrl?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  github?: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  addedBy?: Pick<User, 'id' | 'name'>;
}

export interface EventAttendee {
  eventId: string;
  userId: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  status: number;
  code?: string;
}

// Form types
export interface CreatePaintingData {
  title: string;
  description?: string;
  imageUrl: string;
}

export interface UpdatePaintingData {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateAnnouncementData {
  title: string;
  message: string;
}

export interface UpdateAnnouncementData {
  title?: string;
  message?: string;
}

export interface CreateAlumniData {
  name: string;
  email?: string;
  batchYear?: number;
  details?: string;
  imageUrl?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  github?: string;
}

export interface UpdateAlumniData {
  name?: string;
  email?: string;
  batchYear?: number;
  details?: string;
  imageUrl?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  github?: string;
}

// Admin types
export interface AdminStats {
  users: {
    total: number;
    active: number;
    stale: number;
    admins: number;
    recentSignups: number;
  };
  content: {
    paintings: number;
    events: number;
    announcements: number;
    alumni: number;
    recentPaintings: number;
    recentEvents: number;
  };
}

export interface UpdateUserStatusData {
  isStale: boolean;
  role?: 'MEMBER' | 'ADMIN';
  expiresAt?: string | null;
}

export interface BulkUserActionData {
  userIds: string[];
  action: 'make_stale' | 'activate' | 'promote_to_admin' | 'demote_to_member';
}

export interface UserStats {
  paintingsCount: number;
  eventsCount: number;
  announcementsCount: number;
}

// Query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchUsersParams extends PaginationParams {
  search?: string;
  role?: 'MEMBER' | 'ADMIN';
  isStale?: boolean;
}

export interface SearchAlumniParams extends PaginationParams {
  name?: string;
  batchYear?: number;
  email?: string;
}
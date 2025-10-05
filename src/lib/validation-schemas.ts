import { z } from "zod";

// Painting validation schemas
export const createPaintingSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url("Must be a valid URL"),
});

export const updatePaintingSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long").optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
});

// Event validation schemas
export const createEventSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    // Accepts many string formats and coerces to Date
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const updateEventSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long").optional(),
    description: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start date',
        path: ['endDate'],
      });
    }
  });

// Announcement validation schemas
export const createAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  message: z.string().min(1, "Message is required"),
});

export const updateAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long").optional(),
  message: z.string().min(1, "Message is required").optional(),
});

// Alumni validation schemas
export const createAlumniSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Must be a valid email").optional().nullable(),
  batchYear: z.number().int().min(1900, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future").optional().nullable(),
  details: z.string().optional().nullable(),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
  website: z.string().url("Must be a valid URL").optional().nullable(),
  linkedin: z.string().url("Must be a valid URL").optional().nullable(),
  twitter: z.string().url("Must be a valid URL").optional().nullable(),
  instagram: z.string().url("Must be a valid URL").optional().nullable(),
  github: z.string().url("Must be a valid URL").optional().nullable(),
});

export const updateAlumniSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long").optional(),
  email: z.string().email("Must be a valid email").optional().nullable(),
  batchYear: z.number().int().min(1900, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future").optional().nullable(),
  details: z.string().optional().nullable(),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
  website: z.string().url("Must be a valid URL").optional().nullable(),
  linkedin: z.string().url("Must be a valid URL").optional().nullable(),
  twitter: z.string().url("Must be a valid URL").optional().nullable(),
  instagram: z.string().url("Must be a valid URL").optional().nullable(),
  github: z.string().url("Must be a valid URL").optional().nullable(),
});

// Admin validation schemas
export const updateUserStatusSchema = z.object({
  isStale: z.boolean(),
  role: z.enum(["MEMBER", "ADMIN"]).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const bulkUserActionSchema = z.object({
  userIds: z.array(z.string().uuid("Invalid user ID")),
  action: z.enum(["make_stale", "activate", "promote_to_admin", "demote_to_member"]),
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
});

export const searchUsersSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["MEMBER", "ADMIN"]).optional(),
  isStale: z.boolean().optional(),
});

export const searchAlumniSchema = z.object({
  name: z.string().optional(),
  batchYear: z.number().int().optional(),
  email: z.string().optional(),
});

export const searchPaintingsSchema = z.object({
  search: z.string().optional(),
});

// Type exports for convenience
export type CreatePaintingInput = z.infer<typeof createPaintingSchema>;
export type UpdatePaintingInput = z.infer<typeof updatePaintingSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
export type CreateAlumniInput = z.infer<typeof createAlumniSchema>;
export type UpdateAlumniInput = z.infer<typeof updateAlumniSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type BulkUserActionInput = z.infer<typeof bulkUserActionSchema>;

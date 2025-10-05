# Frontend Validation Schema Usage Guide

## Quick Start

Import the schemas you need:

```typescript
import {
  createPaintingSchema,
  createEventSchema,
  createAnnouncementSchema,
  createAlumniSchema,
  updateUserStatusSchema,
  // ... etc
} from '@/lib/validation-schemas';
```

## Usage with React Hook Form

### Example: Create Painting Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPaintingSchema, type CreatePaintingInput } from '@/lib/validation-schemas';
import { useCreatePainting } from '@/lib/hooks/use-api';

export function CreatePaintingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreatePaintingInput>({
    resolver: zodResolver(createPaintingSchema),
    defaultValues: {
      title: '',
      description: null,
      imageUrl: '',
    }
  });

  const createPainting = useCreatePainting((data) => {
    console.log('Painting created:', data);
  });

  const onSubmit = (data: CreatePaintingInput) => {
    createPainting.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      
      <textarea {...register('description')} />
      
      <input {...register('imageUrl')} />
      {errors.imageUrl && <span>{errors.imageUrl.message}</span>}
      
      <button type="submit">Create</button>
    </form>
  );
}
```

### Example: Create Event Form with Date Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventSchema, type CreateEventInput } from '@/lib/validation-schemas';
import { useCreateEvent } from '@/lib/hooks/use-api';

export function CreateEventForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
  });

  const createEvent = useCreateEvent((data) => {
    console.log('Event created:', data);
  });

  const onSubmit = (data: CreateEventInput) => {
    // Dates are automatically coerced to Date objects by Zod
    // Convert to ISO strings for API
    const payload = {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    };
    createEvent.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      
      <textarea {...register('description')} />
      
      <input {...register('location')} />
      
      <input type="datetime-local" {...register('startDate')} />
      {errors.startDate && <span>{errors.startDate.message}</span>}
      
      <input type="datetime-local" {...register('endDate')} />
      {errors.endDate && <span>{errors.endDate.message}</span>}
      
      <button type="submit">Create Event</button>
    </form>
  );
}
```

### Example: Admin Update User Status

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserStatusSchema, type UpdateUserStatusInput } from '@/lib/validation-schemas';
import { useUpdateUserStatus } from '@/lib/hooks/use-api';

export function UpdateUserStatusForm({ userId }: { userId: string }) {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserStatusInput>({
    resolver: zodResolver(updateUserStatusSchema),
    defaultValues: {
      isStale: false,
      role: 'MEMBER',
      expiresAt: null,
    }
  });

  const updateStatus = useUpdateUserStatus((data) => {
    console.log('User status updated:', data);
  });

  const onSubmit = (data: UpdateUserStatusInput) => {
    updateStatus.mutate({ id: userId, data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <input type="checkbox" {...register('isStale')} />
        Mark as Stale
      </label>
      
      <select {...register('role')}>
        <option value="MEMBER">Member</option>
        <option value="ADMIN">Admin</option>
      </select>
      {errors.role && <span>{errors.role.message}</span>}
      
      <input type="datetime-local" {...register('expiresAt')} />
      {errors.expiresAt && <span>{errors.expiresAt.message}</span>}
      
      <button type="submit">Update Status</button>
    </form>
  );
}
```

## Manual Validation

If you need to validate data without React Hook Form:

```typescript
import { createPaintingSchema } from '@/lib/validation-schemas';

const data = {
  title: 'My Painting',
  description: 'A beautiful artwork',
  imageUrl: 'https://example.com/image.jpg',
};

// Validate
const result = createPaintingSchema.safeParse(data);

if (result.success) {
  console.log('Valid data:', result.data);
  // Use result.data (it's properly typed)
} else {
  console.error('Validation errors:', result.error.errors);
  // result.error.errors is an array of ZodIssue
}
```

## Handling Nullable Fields

Nullable fields can be `null`, `undefined`, or a valid value:

```typescript
// All these are valid
const alumni1 = { name: 'John Doe', email: 'john@example.com', batchYear: 2020 };
const alumni2 = { name: 'Jane Doe', email: null, batchYear: null };
const alumni3 = { name: 'Bob Smith' }; // email and batchYear are undefined
```

In forms with React Hook Form:

```typescript
// Use null as default for nullable fields
const { register } = useForm({
  defaultValues: {
    email: null,
    batchYear: null,
  }
});

// Or handle empty strings
const onSubmit = (data) => {
  const payload = {
    ...data,
    email: data.email || null, // Convert empty string to null
    batchYear: data.batchYear || null,
  };
};
```

## Date Handling Best Practices

### Input Types
Use appropriate HTML input types:
- `<input type="datetime-local">` - For date and time
- `<input type="date">` - For date only
- `<input type="time">` - For time only

### Conversion
```typescript
// Frontend form (datetime-local) -> API (ISO string)
const formData = {
  startDate: new Date('2024-01-15T10:00'), // From form
  endDate: new Date('2024-01-15T12:00'),
};

const apiData = {
  startDate: formData.startDate.toISOString(), // "2024-01-15T10:00:00.000Z"
  endDate: formData.endDate.toISOString(),
};

// API (ISO string) -> Frontend display
const displayDate = new Date(apiData.startDate).toLocaleString();

// API (ISO string) -> Form input (datetime-local format)
const inputValue = apiData.startDate.slice(0, 16); // "2024-01-15T10:00"
```

## Validation Error Messages

All schemas include user-friendly error messages:

```typescript
{
  title: {
    min: "Title is required",
    max: "Title is too long"
  },
  imageUrl: {
    url: "Must be a valid URL"
  },
  email: {
    email: "Must be a valid email"
  },
  batchYear: {
    min: "Invalid year",
    max: "Year cannot be in the future"
  },
  // ... etc
}
```

## Common Patterns

### Optional Fields with Transforms

```typescript
// Convert empty strings to null for optional fields
const transformEmptyToNull = (val: string | undefined) => 
  val === '' || val === undefined ? null : val;

// In your form submission
const onSubmit = (data) => {
  const payload = {
    ...data,
    description: transformEmptyToNull(data.description),
    location: transformEmptyToNull(data.location),
  };
};
```

### Conditional Validation

```typescript
// Example: Only validate endDate if startDate is provided
const conditionalEventSchema = updateEventSchema.superRefine((data, ctx) => {
  if (data.startDate && !data.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'End date is required when start date is provided',
      path: ['endDate'],
    });
  }
});
```

## Schema Reference

### Available Schemas

**Create Operations:**
- `createPaintingSchema`
- `createEventSchema`
- `createAnnouncementSchema`
- `createAlumniSchema`

**Update Operations:**
- `updatePaintingSchema`
- `updateEventSchema`
- `updateAnnouncementSchema`
- `updateAlumniSchema`
- `updateUserStatusSchema`

**Admin Operations:**
- `bulkUserActionSchema`

**Query Parameters:**
- `paginationSchema`
- `searchUsersSchema`
- `searchAlumniSchema`
- `searchPaintingsSchema`

### Type Exports

Use these for TypeScript type safety:

```typescript
import type {
  CreatePaintingInput,
  UpdatePaintingInput,
  CreateEventInput,
  UpdateEventInput,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  CreateAlumniInput,
  UpdateAlumniInput,
  UpdateUserStatusInput,
  BulkUserActionInput,
} from '@/lib/validation-schemas';
```

## Integration with API Client

The validation schemas match the backend API expectations exactly:

```typescript
// Frontend validation schema
createPaintingSchema.parse(data); // ✓ Valid

// API call
apiClient.createPainting(data); // ✓ Types match

// Backend validation
// Uses identical Zod schema (server/src/validation/schemas.ts)
```

This ensures type safety and validation consistency across the entire stack.

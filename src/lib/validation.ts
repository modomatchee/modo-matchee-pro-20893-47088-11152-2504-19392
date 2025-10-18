import { z } from 'zod';

export const signupSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required')
});

export const mealSchema = z.object({
  meal_name: z.string()
    .trim()
    .min(1, 'Meal name is required')
    .max(200, 'Meal name must be less than 200 characters'),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack'], {
    errorMap: () => ({ message: 'Please select a valid meal type' })
  }),
  total_calories: z.number()
    .int('Calories must be a whole number')
    .min(0, 'Calories cannot be negative')
    .max(10000, 'Calories must be less than 10,000'),
  total_protein: z.number()
    .int('Protein must be a whole number')
    .min(0, 'Protein cannot be negative')
    .max(1000, 'Protein must be less than 1,000g'),
  total_carbs: z.number()
    .int('Carbs must be a whole number')
    .min(0, 'Carbs cannot be negative')
    .max(2000, 'Carbs must be less than 2,000g'),
  total_fats: z.number()
    .int('Fats must be a whole number')
    .min(0, 'Fats cannot be negative')
    .max(500, 'Fats must be less than 500g'),
  notes: z.string()
    .max(1000, 'Notes must be less than 1,000 characters')
    .optional()
});

export const calendarEventSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1,000 characters')
    .optional(),
  event_type: z.enum(['workout', 'meal', 'match', 'other'], {
    errorMap: () => ({ message: 'Please select a valid event type' })
  }),
  start_time: z.string()
    .min(1, 'Start time is required'),
  end_time: z.string()
    .min(1, 'End time is required'),
  location: z.string()
    .max(200, 'Location must be less than 200 characters')
    .optional()
}).refine(
  (data) => {
    if (data.start_time && data.end_time) {
      return new Date(data.end_time) > new Date(data.start_time);
    }
    return true;
  },
  {
    message: 'End time must be after start time',
    path: ['end_time']
  }
);

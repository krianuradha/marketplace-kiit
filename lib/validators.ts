import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.enum(['M', 'F'], {
    errorMap: () => ({ message: 'Gender must be M (Male) or F (Female)' }),
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  negotiable: z.boolean().default(false),
  usedTime: z.string().min(1, 'Please specify how long it was used'),
  category: z.enum(['Clothing', 'Furniture', 'Electronics', 'Books', 'Sports', 'Home & Kitchen', 'Other']),
  section: z.enum(["Queen's Castle", "King Palace"]),
  imageUrl: z.string().optional(),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

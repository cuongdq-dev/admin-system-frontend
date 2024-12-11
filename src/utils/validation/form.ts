// utils/validation/form.ts
import { z } from 'zod';

// Define the file size limit and accepted file types as constants
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export const formSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(3, 'Name should be at least 3 characters'),
  description: z
    .string()
    .min(10, 'Description should be at least 10 characters long')
    .optional()
    .or(z.literal('')),
  private: z.boolean().optional(),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Only the following image types are allowed: ${ACCEPTED_IMAGE_TYPES.join(', ')}.`
    )
    .optional()
    .nullable(),
});

export type FormSchema = z.infer<typeof formSchema>;

export const GetValuesFormChange = (
  initialData: Record<string, any>,
  currentValues: Record<string, any>
) => {
  const deepCompare = (initial: any, current: any): any => {
    if (initial === current) return undefined; // No change

    if (
      typeof initial !== 'object' ||
      initial === null ||
      typeof current !== 'object' ||
      current === null
    ) {
      // If it's not an object (or is null), return the current value as the change
      return current;
    }

    if (Array.isArray(initial) !== Array.isArray(current)) {
      // If one is an array and the other is not, they are considered different
      return current;
    }

    if (Array.isArray(initial)) {
      // Handle array comparison
      if (initial.length !== current.length) {
        return current; // Arrays are different if lengths differ
      }
      // Recursively compare each array element
      for (let i = 0; i < initial.length; i++) {
        const diff = deepCompare(initial[i], current[i]);
        if (diff !== undefined) {
          return current; // Return the entire array if any element differs
        }
      }
      return undefined; // No change in array
    }

    // Handle object comparison
    const result: Record<string, any> = {};
    const keys = new Set([...Object.keys(initial), ...Object.keys(current)]);
    for (const key of keys) {
      const diff = deepCompare(initial[key], current[key]);
      if (diff !== undefined) {
        result[key] = diff; // Collect differences
      }
    }
    return Object.keys(result).length ? result : undefined; // Return empty if no changes
  };

  return deepCompare(initialData, currentValues) || {};
};

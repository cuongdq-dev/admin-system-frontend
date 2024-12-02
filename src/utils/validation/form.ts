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
  const changedFields = Object.keys(currentValues).reduce(
    (acc, key) => {
      if (currentValues[key] !== initialData[key]) {
        acc[key] = currentValues[key];
      }
      return acc;
    },
    {} as Record<string, any>
  );

  return changedFields;
};

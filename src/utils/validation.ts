import { z } from 'zod';

export const textSchema = (max: number, optional = false) =>
  z.object({
    value: optional
      ? z.string().trim().max(max, 'validation.tooLong')
      : z.string().trim().min(1, 'validation.required').max(max, 'validation.tooLong'),
  });

export const nameSchema = z.string().trim().max(40);
export const LIMITS = { journal: 5000, short: 120, name: 40, note: 500 };

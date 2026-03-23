import { ZodError } from 'zod';

export class ErrorUtil {
  public static getErrorMessage(error: Error) {
    if (error instanceof ZodError) return error?.errors?.[0]?.message || 'Validation error';
    return error?.message || 'An unknown error occurred';
  }
}

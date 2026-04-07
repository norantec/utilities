import { ZodError } from 'zod';

export class ErrorUtil {
  public static getErrorMessage(error: Error) {
    if (error instanceof ZodError) {
      try {
        return `Parameters failed to pass validator rules: ${error.errors.map((subError) => subError.path.join('.')).join(', ')}`;
      } catch {
        return 'Parameters validation error';
      }
    }
    return error?.message || 'An unknown error occurred';
  }
}

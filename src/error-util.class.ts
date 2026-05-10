import { ZodError } from 'zod';
import { UUIDUtil } from './uuid-util.class';

function isZodError(error: unknown): error is ZodError {
  return typeof error === 'object' && error !== null && 'issues' in error && Array.isArray((error as any).issues);
}

class ResponseError extends Error {
  public constructor(
    message?: string | undefined,
    public readonly statusCode: number = 500,
    public readonly status: number = 500,
    public readonly code: number = 500,
  ) {
    super(message);
  }
}

export class ErrorUtil {
  public static createResponseError(error: Error, statusCode: number = 500): ResponseError {
    return new ResponseError(error.message, statusCode, statusCode, statusCode);
  }

  public static formatError(error: Error) {
    const id = UUIDUtil.generateV4();
    let message: string;
    let errorLogs: string[] = [];

    if (isZodError(error)) {
      message = JSON.stringify({
        message: 'Failed to validate your input data ({{context.trace}})',
        context: {
          trace: id,
        },
      });
      errorLogs.push(JSON.stringify(error.issues));
    } else {
      message = JSON.stringify({
        message: `${error.message || 'An unknown error occurred'} ({{context.trace}})`,
        context: {
          trace: id,
        },
      });
    }

    errorLogs.push(error?.stack || 'No stack trace available');

    return {
      id,
      message,
      logs: errorLogs.map((log) => `[AUTO_ERROR] [${id}] [${new Date().toISOString()}] ${log}`),
      response: new Response(message, {
        status: (() => {
          if (isZodError(error)) return 400;
          if (error instanceof ResponseError) return error.statusCode;
          return 500;
        })(),
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
}

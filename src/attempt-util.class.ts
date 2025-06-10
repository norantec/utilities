export class AttemptUtil {
    public static exec<T>(callbackFn: () => T): T | Error {
        try {
            return callbackFn?.();
        } catch (error) {
            return error as Error;
        }
    }

    public static async execPromise<T>(promise: Promise<T>): Promise<T | Error> {
        try {
            return promise?.catch?.((error) => Promise.resolve(error as Error));
        } catch (error) {
            return error as Error;
        }
    }
}

import { StringUtil } from './string-util.class';
import { InferType, Schema } from 'yup';

export class ValidateUtil {
    public static isValidIPv4Address(address: string) {
        if (StringUtil.isFalsyString(address)) return false;
        return (
            /^(\d{1,3}\.){3}\d{1,3}$/.test(address || '') &&
            address!.split('.').every((segment) => Number(segment) >= 0 && Number(segment) <= 255)
        );
    }

    /**
     * Casts and validates an input based on the provided Yup schema.
     * Returns the fully casted and validated result.
     * Throws if validation fails.
     */
    public static cast<T extends Schema<any>>(schema: T, input: unknown): InferType<T> {
        const casted = schema.cast(input);
        schema.validateSync(casted); // throws if invalid
        return casted as InferType<T>;
    }
}

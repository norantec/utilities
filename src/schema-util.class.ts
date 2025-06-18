import { z } from 'zod';

export class SchemaUtil {
    public static ref<BS extends z.Schema, FS extends z.Schema>(baseSchema: BS, callback: (baseSchema: BS) => FS) {
        return callback(baseSchema);
    }
}

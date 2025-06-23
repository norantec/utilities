/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';

export class SchemaUtil {
    public static readonly ID = z.string().uuid();
    public static readonly ID_OBJECT = z.object({
        id: SchemaUtil.ID,
    });
    public static readonly JSON_STRING = z.string().refine((value) => {
        try {
            JSON.parse(value);
            return true;
        } catch {
            return false;
        }
    });
    public static readonly TIME_RECORD = z.object({
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
    });
    public static readonly ORDER_ORIENTATION = z.enum(['ASC', 'DESC']);
    public static readonly WHERE_CLAUSE_OP = z.enum([
        'adjacent',
        'any',
        'between',
        'col',
        'contained',
        'contains',
        'endsWith',
        'eq',
        'gt',
        'gte',
        'iLike',
        'in',
        'iRegexp',
        'is',
        'like',
        'lt',
        'lte',
        'match',
        'ne',
        'noExtendLeft',
        'noExtendRight',
        'not',
        'notBetween',
        'notILike',
        'notIn',
        'notIRegexp',
        'notLike',
        'notRegexp',
        'overlap',
        'placeholder',
        'regexp',
        'startsWith',
        'strictLeft',
        'strictRight',
        'substring',
        'values',
    ]);
    public static readonly COMMON_RESULT = z
        .object({
            succeeded: z.boolean(),
            content: z.string().optional(),
        })
        .merge(SchemaUtil.ID_OBJECT.partial())
        .merge(SchemaUtil.TIME_RECORD);
    public static readonly WHERE_CLAUSE = z.object({
        field: z.string(),
        op: SchemaUtil.WHERE_CLAUSE_OP,
        value: SchemaUtil.JSON_STRING,
    });
    public static readonly ORDER_ITEM = z.object({
        field: z.string(),
        orientation: SchemaUtil.ORDER_ORIENTATION,
    });
    public static readonly PAGINATION_OPTIONS = z.object({
        createdAtField: z.union([z.string().optional().default('createdAt'), z.undefined()]),
        cursorField: z.union([z.string().optional().default('id'), z.undefined()]),
        lastCursor: z.string().optional(),
        limit: z.number().positive().optional(),
        order: z.array(SchemaUtil.ORDER_ITEM).optional(),
        where: z.array(z.array(SchemaUtil.WHERE_CLAUSE).min(1)).optional(),
    });
    public static readonly FIND_ONE_OPTIONS = SchemaUtil.PAGINATION_OPTIONS.omit({
        limit: true,
        lastCursor: true,
        order: true,
    });
    public static readonly PAGINATION_RESULT = z.object({
        hasNext: z.boolean(),
        nextCursor: z.union([z.string(), z.null()]),
        previousCursor: z.union([z.string(), z.null()]),
    });
    public static readonly FILE = z
        .object({
            mimeType: z.string(),
            name: z.string(),
            progres: z.number().min(0).max(1),
            size: z.number().positive(),
            url: z.string(),
        })
        .merge(SchemaUtil.TIME_RECORD);
}

export namespace Schema {
    export type CommonResult = z.infer<typeof SchemaUtil.COMMON_RESULT>;
    export type IDObject = z.infer<typeof SchemaUtil.ID_OBJECT>;
    export type File = z.infer<typeof SchemaUtil.FILE>;
    export type FindOneOptions = z.infer<typeof SchemaUtil.FIND_ONE_OPTIONS>;
    export type OrderItem = z.infer<typeof SchemaUtil.ORDER_ITEM>;
    export type OrderOrientation = z.infer<typeof SchemaUtil.ORDER_ORIENTATION>;
    export type PaginationOptions = z.infer<typeof SchemaUtil.PAGINATION_OPTIONS>;
    export type PaginationResult = z.infer<typeof SchemaUtil.PAGINATION_RESULT>;
    export type TimeRecord = z.infer<typeof SchemaUtil.TIME_RECORD>;
    export type WhereClause = z.infer<typeof SchemaUtil.WHERE_CLAUSE>;
    export type WhereClauseOp = z.infer<typeof SchemaUtil.WHERE_CLAUSE_OP>;
}

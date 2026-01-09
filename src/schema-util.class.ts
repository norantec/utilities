/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';
import { DateUtil } from './date-util.class';

const FIND_ONE_OPTIONS_OMIT_PARAMS = {
  limit: true,
  lastCursor: true,
} as const;

export namespace Enum {
  export const OrderOrientation = {
    ASC: 'ASC',
    DESC: 'DESC',
  } as const;
  export const WhereClauseOp = {
    ADJACENT: 'adjacent',
    ANY: 'any',
    BETWEEN: 'between',
    COL: 'col',
    CONTAINED: 'contained',
    CONTAINS: 'contains',
    ENDS_WITH: 'endsWith',
    EQ: 'eq',
    GT: 'gt',
    GTE: 'gte',
    I_LIKE: 'iLike',
    IN: 'in',
    I_REGEXP: 'iRegexp',
    IS: 'is',
    LIKE: 'like',
    LT: 'lt',
    LTE: 'lte',
    MATCH: 'match',
    NE: 'ne',
    NO_EXTEND_LEFT: 'noExtendLeft',
    NO_EXTEND_RIGHT: 'noExtendRight',
    NOT: 'not',
    NOT_BETWEEN: 'notBetween',
    NOT_I_LIKE: 'notILike',
    NOT_IN: 'notIn',
    NOT_I_REGEXP: 'notIRegexp',
    NOT_LIKE: 'notLike',
    NOT_REGEXP: 'notRegexp',
    OVERLAP: 'overlap',
    PLACEHOLDER: 'placeholder',
    REGEXP: 'regexp',
    STARTS_WITH: 'startsWith',
    STRICT_LEFT: 'strictLeft',
    STRICT_RIGHT: 'strictRight',
    SUBSTRING: 'substring',
    VALUES: 'values',
  } as const;
  export const LogLevel = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    VERBOSE: 'verbose',
    DEBUG: 'debug',
  } as const;
}

export class SchemaUtil {
  public static createEnumSchema<const T extends Record<string, string>>(object: T) {
    return z.enum(Object.values(object) as [T[keyof T], ...T[keyof T][]]);
  }

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
  public static readonly DATE_STRING = z.string().refine((value) => DateUtil.isValidDateString(value));
  public static readonly TIME_RECORD = z.object({
    createdAt: SchemaUtil.DATE_STRING.nullable().optional(),
    updatedAt: SchemaUtil.DATE_STRING.nullable().optional(),
  });
  public static readonly ORDER_ORIENTATION = SchemaUtil.createEnumSchema(Enum.OrderOrientation);
  public static readonly WHERE_CLAUSE_OP = SchemaUtil.createEnumSchema(Enum.WhereClauseOp);
  public static readonly LOG_LEVEL = SchemaUtil.createEnumSchema(Enum.LogLevel);
  public static readonly COMMON_RESULT = z
    .object({
      succeeded: z.boolean(),
      content: z.string().optional(),
    })
    .merge(SchemaUtil.ID_OBJECT.partial())
    .merge(SchemaUtil.TIME_RECORD);
  public static readonly WHERE_CLAUSE = z.discriminatedUnion('type', [
    z.object({
      field: z.string(),
      op: SchemaUtil.WHERE_CLAUSE_OP,
      type: z.literal('condition'),
      value: SchemaUtil.JSON_STRING,
    }),
    z.object({
      literal: z.string().min(1),
      params: z.array(z.any()).optional(),
      type: z.literal('literal'),
    }),
  ]);
  public static readonly CONDITION_ONLY_WHERE_CLAUSE = SchemaUtil.WHERE_CLAUSE.superRefine((value, context) => {
    if (value?.type === 'literal') {
      context.addIssue({
        code: 'custom',
        message: 'Literal where clause item is strictly forbidden for safety reasons',
      });
    }
  });
  public static readonly ORDER_ITEM = z.object({
    field: z.string(),
    orientation: SchemaUtil.ORDER_ORIENTATION,
  });
  public static readonly PAGINATION_OPTIONS = z.object({
    cursorField: z.union([z.string().optional().default('id'), z.undefined()]),
    cursorFieldOrderOrientation: z.union([SchemaUtil.ORDER_ORIENTATION.default('DESC'), z.undefined()]),
    lastCursor: z.string().optional(),
    limit: z.number().min(0).optional(),
    order: z.array(SchemaUtil.ORDER_ITEM).optional(),
    orderField: z.union([z.string().optional().default('createdAt'), z.undefined()]),
    orderFieldOrderOrientation: z.union([SchemaUtil.ORDER_ORIENTATION.default('DESC'), z.undefined()]),
    where: z.array(z.array(SchemaUtil.WHERE_CLAUSE).min(1)).optional(),
  });
  public static readonly FIND_ONE_OPTIONS = SchemaUtil.PAGINATION_OPTIONS.omit(FIND_ONE_OPTIONS_OMIT_PARAMS);
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
      size: z.number().min(0),
      url: z.string(),
    })
    .merge(SchemaUtil.TIME_RECORD);
  public static readonly CONDITION_ONLY_PAGINATION_OPTIONS = SchemaUtil.PAGINATION_OPTIONS.omit({
    where: true,
  }).extend({ where: z.array(z.array(SchemaUtil.CONDITION_ONLY_WHERE_CLAUSE).min(1)).optional() });
  public static readonly CONDITION_ONLY_FIND_ONE_OPTIONS =
    SchemaUtil.CONDITION_ONLY_PAGINATION_OPTIONS.omit(FIND_ONE_OPTIONS_OMIT_PARAMS);
}

export namespace Schema {
  export type CommonResult = z.infer<typeof SchemaUtil.COMMON_RESULT>;
  export type File = z.infer<typeof SchemaUtil.FILE>;
  export type FindOneOptions = z.infer<typeof SchemaUtil.FIND_ONE_OPTIONS>;
  export type IDObject = z.infer<typeof SchemaUtil.ID_OBJECT>;
  export type LogLevel = z.infer<typeof SchemaUtil.LOG_LEVEL>;
  export type OrderItem = z.infer<typeof SchemaUtil.ORDER_ITEM>;
  export type OrderOrientation = z.infer<typeof SchemaUtil.ORDER_ORIENTATION>;
  export type PaginationOptions = z.infer<typeof SchemaUtil.PAGINATION_OPTIONS>;
  export type PaginationResult = z.infer<typeof SchemaUtil.PAGINATION_RESULT>;
  export type TimeRecord = z.infer<typeof SchemaUtil.TIME_RECORD>;
  export type WhereClause = z.infer<typeof SchemaUtil.WHERE_CLAUSE>;
  export type WhereClauseOp = z.infer<typeof SchemaUtil.WHERE_CLAUSE_OP>;
}

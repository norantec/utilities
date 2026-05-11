import { DateUtil } from './date-util.class';
import { EnumUtil } from './enum-util.class';
import { Enums } from './enums';
import { z } from './zod';

const FIND_ONE_OPTIONS_OMIT_PARAMS = {
  limit: true,
  lastCursor: true,
} as const;

export namespace Schemas {
  export const ID = z.uuid();

  export const ID_LIST = z.array(Schemas.ID).min(1);

  export const ID_LIST_OBJECT = z.object({
    idList: Schemas.ID_LIST,
  });

  export const ID_OBJECT = z.object({
    id: Schemas.ID,
  });

  export const JSON_STRING = z.string().refine((value) => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  });

  export const DATE_STRING = z.string().refine((value) => DateUtil.isValidDateString(value));

  export const TIME_RECORD = z.object({
    createdAt: Schemas.DATE_STRING.nullable().optional(),
    updatedAt: Schemas.DATE_STRING.nullable().optional(),
  });

  export const ORDER_ORIENTATION = EnumUtil.createEnumSchema(Enums.OrderOrientation);

  export const WHERE_CLAUSE_OP = EnumUtil.createEnumSchema(Enums.WhereClauseOp);

  export const LOG_LEVEL = EnumUtil.createEnumSchema(Enums.LogLevel);

  export const COMMON_RESULT = z
    .object({
      succeeded: z.boolean(),
      content: z.string().optional(),
    })
    .extend(Schemas.ID_OBJECT.partial().shape)
    .extend(Schemas.TIME_RECORD.shape);

  export const WHERE_CLAUSE = z.discriminatedUnion('type', [
    z.object({
      field: z.string(),
      op: Schemas.WHERE_CLAUSE_OP,
      type: z.literal('condition'),
      value: Schemas.JSON_STRING,
    }),
    z.object({
      literal: z.string().min(1),
      params: z.array(z.any()).optional(),
      type: z.literal('literal'),
    }),
  ]);

  export const CONDITION_ONLY_WHERE_CLAUSE = Schemas.WHERE_CLAUSE.superRefine((value, context) => {
    if (value?.type === 'literal') {
      context.addIssue({
        code: 'custom',
        message: 'Literal where clause item is strictly forbidden for safety reasons',
      });
    }
  });

  export const ORDER_ITEM = z.object({
    field: z.string(),
    orientation: Schemas.ORDER_ORIENTATION,
  });

  export const PAGINATION_OPTIONS = z.object({
    cursorField: z.union([z.string().optional().default('id'), z.undefined()]).optional(),
    cursorFieldOrderOrientation: z.union([Schemas.ORDER_ORIENTATION.default('DESC'), z.undefined()]).optional(),
    lastCursor: z.string().optional(),
    limit: z.number().min(0).optional(),
    search: z
      .object({
        fields: z.array(
          z.union([
            z.string().min(1),
            z.object({
              field: z.string().min(1),
              ratio: z.number().min(-1).max(1).optional().default(1),
            }),
          ]),
        ),
        value: z.string().min(1),
      })
      .optional(),
    order: z.array(Schemas.ORDER_ITEM).optional(),
    orderField: z.union([z.string().optional().default('createdAt'), z.undefined()]).optional(),
    orderFieldOrderOrientation: z.union([Schemas.ORDER_ORIENTATION.default('DESC'), z.undefined()]).optional(),
    where: z.array(z.array(Schemas.WHERE_CLAUSE).min(1)).optional(),
  });

  export const FIND_ONE_OPTIONS = Schemas.PAGINATION_OPTIONS.omit(FIND_ONE_OPTIONS_OMIT_PARAMS);

  export const PAGINATION_RESULT = z.object({
    hasNext: z.boolean(),
    nextCursor: z.union([z.string(), z.null()]),
    previousCursor: z.union([z.string(), z.null()]),
  });

  export const FILE = z
    .object({
      mimeType: z.string(),
      name: z.string(),
      progres: z.number().min(0).max(1),
      size: z.number().min(0),
      url: z.string(),
    })
    .extend(Schemas.TIME_RECORD.shape);

  export const CONDITION_ONLY_PAGINATION_OPTIONS = Schemas.PAGINATION_OPTIONS.omit({
    where: true,
  }).extend({ where: z.array(z.array(Schemas.CONDITION_ONLY_WHERE_CLAUSE).min(1)).optional() });

  export const CONDITION_ONLY_FIND_ONE_OPTIONS =
    Schemas.CONDITION_ONLY_PAGINATION_OPTIONS.omit(FIND_ONE_OPTIONS_OMIT_PARAMS);
}

export namespace SchemaTypes {
  export type CommonResult = z.output<typeof Schemas.COMMON_RESULT>;
  export type File = z.infer<typeof Schemas.FILE>;
  export type FindOneOptions = z.infer<typeof Schemas.FIND_ONE_OPTIONS>;
  export type IDObject = z.infer<typeof Schemas.ID_OBJECT>;
  export type LogLevel = z.infer<typeof Schemas.LOG_LEVEL>;
  export type OrderItem = z.infer<typeof Schemas.ORDER_ITEM>;
  export type OrderOrientation = z.infer<typeof Schemas.ORDER_ORIENTATION>;
  export type PaginationOptions = z.infer<typeof Schemas.PAGINATION_OPTIONS>;
  export type PaginationResult = z.infer<typeof Schemas.PAGINATION_RESULT>;
  export type TimeRecord = z.infer<typeof Schemas.TIME_RECORD>;
  export type WhereClause = z.infer<typeof Schemas.WHERE_CLAUSE>;
  export type WhereClauseOp = z.infer<typeof Schemas.WHERE_CLAUSE_OP>;
}

console.log(Schemas.COMMON_RESULT.toJSONSchema());

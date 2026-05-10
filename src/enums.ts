export namespace Enums {
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

export namespace EnumTypes {
  export type OrderOrientation = (typeof Enums.OrderOrientation)[keyof typeof Enums.OrderOrientation];
  export type WhereClauseOp = (typeof Enums.WhereClauseOp)[keyof typeof Enums.WhereClauseOp];
  export type LogLevel = (typeof Enums.LogLevel)[keyof typeof Enums.LogLevel];
}

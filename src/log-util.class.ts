import { Schema } from './schema-util.class';

const LOG_LEVELS: Schema.LogLevel[] = ['debug', 'verbose', 'info', 'warn', 'error'];

export class LogUtil {
  public match(bottomLogLevel: Schema.LogLevel | boolean, logLevel: Schema.LogLevel) {
    if (bottomLogLevel === false) return false;
    if (bottomLogLevel === true) return true;
    return LOG_LEVELS.slice(LOG_LEVELS.findIndex((level) => level === bottomLogLevel)).includes(logLevel);
  }
}

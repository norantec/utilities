import { Schema } from './schema-util.class';

const LOG_LEVELS: Schema.LogLevel[] = ['debug', 'verbose', 'info', 'warn', 'error'];

export class LogUtil {
    public match(bottomLogLevel: Schema.LogLevel | false, logLevel: Schema.LogLevel) {
        if (bottomLogLevel === false) return false;
        return LOG_LEVELS.slice(0, LOG_LEVELS.findIndex((level) => level === bottomLogLevel) + 1).includes(logLevel);
    }
}

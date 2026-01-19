import { Schema } from './schema-util.class';
import { StringUtil } from './string-util.class';
import { cyan, gray, yellow, red } from 'colors';

const LOG_LEVELS: Schema.LogLevel[] = ['debug', 'verbose', 'info', 'warn', 'error'];

export class LogUtil {
  public constructor(private readonly defaultLogLevel: Schema.LogLevel = 'info') {}

  public match(bottomLogLevel: Schema.LogLevel | boolean, logLevel: Schema.LogLevel) {
    if (bottomLogLevel === false) return false;
    if (bottomLogLevel === true) return true;
    return LOG_LEVELS.slice(LOG_LEVELS.findIndex((level) => level === bottomLogLevel)).includes(logLevel);
  }

  public log(level: Schema.LogLevel, message: string | Error) {
    const colorizer = (() => {
      switch (level) {
        case 'debug':
          return gray;
        case 'verbose':
          return cyan;
        case 'info':
          return (text: string) => text;
        case 'warn':
          return yellow;
        case 'error':
          return red;
        default:
          return (text: string) => text;
      }
    })();

    if (this.match(this.defaultLogLevel, level) === false) return;

    const finalExtraMessage =
      level === 'debug' || (this.defaultLogLevel === 'debug' && level === 'error')
        ? (message instanceof Error ? message : new Error()).stack?.split?.('\n')?.slice(1)?.join('\n')
        : '';

    console.log(
      colorizer(
        `[${new Date().toLocaleString()}] [${level.toUpperCase()}] ${message instanceof Error ? message.message : message}${StringUtil.isFalsyString(finalExtraMessage) ? '' : `\n${finalExtraMessage}`}`,
      ),
    );
  }
}

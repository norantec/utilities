import { StringUtil } from './string-util.class';

export class HeaderUtil {
  public static parse(headers: Record<string, any>) {
    const getValue = (name: string) => {
      if (!headers || StringUtil.isFalsyString(name)) {
        return null;
      }
      try {
        return Object.entries(headers).find(([key]) => {
          if (StringUtil.isFalsyString(key) || key.toUpperCase() !== name.toUpperCase()) {
            return false;
          }
          return true;
        })?.[1];
      } catch {
        return null;
      }
    };
    return {
      getValue,
    };
  }
}

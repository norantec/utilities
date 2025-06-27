import { StringUtil } from './string-util.class';

export class DateUtil {
    public static isValidDate(date: Date) {
        return date instanceof Date && !Number.isNaN(Date.prototype.getTime.call(date));
    }

    public static isValidDateString(value: string) {
        if (StringUtil.isFalsyString(value)) return false;
        return DateUtil.isValidDate(new Date(value));
    }
}

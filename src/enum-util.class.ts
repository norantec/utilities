export interface IEnum {
  [x: string]: any;
}

export class EnumUtil {
  public static getEntries(inputEnum: IEnum): Array<[string, any]> {
    try {
      return Object.entries(inputEnum).filter(([key]) => {
        return (key.length > 1 && key.startsWith('0')) || Number.isNaN(Number(key));
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return [];
    }
  }

  public static isValidValue(inputEnum: IEnum, inputValue: any) {
    const entries = EnumUtil.getEntries(inputEnum);
    if (entries.length === 0) return false;
    return entries.some(([, value]) => value === inputValue);
  }

  public static isEqual(enum1: IEnum, enum2: IEnum) {
    const entries1 = this.getEntries(enum1);
    const entries2 = this.getEntries(enum2);

    if (entries1.length !== entries2.length) {
      return false;
    }

    if (entries1.length === 0) {
      return true;
    }

    for (const [key, value] of entries1) {
      if (entries2[key] !== value) {
        return false;
      }
    }

    return true;
  }
}

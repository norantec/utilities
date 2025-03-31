interface Enum {
    [x: string]: any;
}

export class EnumUtil {
    public static getEntries(inputEnum: Enum): Array<[string, any]> {
        try {
            return Object.entries(inputEnum).filter(([key]) => Number.isNaN(Number(key)));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return [];
        }
    }

    public static isEqual(enum1: Enum, enum2: Enum) {
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

export class UUIDUtil {
    public static generateV4() {
        if (typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function') {
            try {
                return window.crypto.randomUUID();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {}
        } else if (typeof global !== 'undefined' && typeof global.crypto?.randomUUID === 'function') {
            try {
                return global.crypto.randomUUID();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {}
        }

        const hex: string[] = [];
        const bytes = new Uint8Array(16);

        for (let i = 0; i < 16; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }

        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        for (let i = 0; i < 16; i++) {
            hex.push(bytes[i].toString(16).padStart(2, '0'));
        }

        return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
    }
}

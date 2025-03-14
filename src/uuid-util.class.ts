export class UUIDUtil {
    public static generateV4() {
        let getRandomValues: (buffer: Uint8Array) => Uint8Array;

        if (typeof window !== 'undefined' && typeof window.crypto?.getRandomValues === 'function') {
            getRandomValues = window.crypto.getRandomValues.bind(window.crypto);
        } else {
            const crypto = require('crypto-browserify');
            getRandomValues = (buffer: Uint8Array) => {
                return new Uint8Array(crypto.randomFillSync(buffer));
            };
        }

        const bytes = new Uint8Array(16);
        getRandomValues(bytes);

        bytes[6] = (bytes[6] & 0x0f) | 0x40; // 版本号4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // 变体

        return [...bytes]
            .map((b, i) => ([4, 6, 8, 10].includes(i) ? '-' : '') + b.toString(16).padStart(2, '0'))
            .join('');
    }
}

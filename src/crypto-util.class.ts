export class CryptoUtil {
    public static async importRsaPkcs8Pem(
        pemString: string,
        algorithm: AlgorithmIdentifier,
        keyUsages: Iterable<KeyUsage>,
    ) {
        // Remove PEM headers, footers, and newlines
        const base64 = pemString.replace(/(-----(BEGIN|END) (PUBLIC|PRIVATE) KEY-----|\n|\r)/g, '').trim();

        // Base64 decode to binary string
        const binaryString = atob(base64);

        // Convert binary string to ArrayBuffer
        const keyArrayBuffer = new ArrayBuffer(binaryString.length);
        const keyArrayBufferView = new Uint8Array(keyArrayBuffer);

        for (let i = 0; i < binaryString.length; i += 1) {
            keyArrayBufferView[i] = binaryString.charCodeAt(i);
        }

        // Import the key
        const importedKey = await crypto.subtle.importKey(
            'pkcs8',
            keyArrayBuffer,
            algorithm,
            true, // extractable
            keyUsages,
        );

        return importedKey;
    }
}

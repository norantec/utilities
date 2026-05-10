export class CryptoUtil {
  public static async importRsaPrivatePemKey(
    pemString: string,
    algorithm: AlgorithmIdentifier,
    keyUsages: Iterable<KeyUsage>,
  ) {
    // Remove PEM headers, footers, and newlines
    const base64 = pemString.replace(/(-----(BEGIN|END) PRIVATE KEY-----|\n|\r)/g, '').trim();

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

  public static async importRsaPublicPemKey(
    pemString: string,
    algorithm: AlgorithmIdentifier,
    keyUsages: Iterable<KeyUsage>,
  ) {
    // Remove PEM headers, footers, and newlines
    const base64 = pemString.replace(/(-----(BEGIN|END) PUBLIC KEY-----|\n|\r)/g, '').trim();

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
      'spki',
      keyArrayBuffer,
      algorithm,
      true, // extractable
      keyUsages,
    );

    return importedKey;
  }

  public static async sha256Hex(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}

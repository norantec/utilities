import * as crypto from 'node:crypto';

export class ECDHUtil {
  public readonly ecdh = crypto.createECDH(this.curveName);
  protected readonly ALGORITHM: crypto.CipherGCMTypes = 'aes-256-gcm';

  public constructor(private readonly curveName: string = 'prime256v1') {}

  public encrypt(data: string, otherPublicKey: Buffer): string {
    const sharedKey = this.ecdh.computeSecret(new Uint8Array(otherPublicKey));
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.ALGORITHM, new Uint8Array(sharedKey), new Uint8Array(iv));
    const encrypted = Buffer.concat([new Uint8Array(cipher.update(data, 'utf-8')), new Uint8Array(cipher.final())]);
    return Buffer.concat([new Uint8Array(iv), new Uint8Array(encrypted), new Uint8Array(cipher.getAuthTag())]).toString(
      'base64',
    );
  }

  public decrypt(encryptedData: string, otherPublicKey: Buffer): string {
    const sharedKey = this.ecdh.computeSecret(new Uint8Array(otherPublicKey));
    const data = Buffer.from(encryptedData, 'base64');
    const iv = data.subarray(0, 16);
    const authTag = data.subarray(data.length - 16);
    const encrypted = data.subarray(16, data.length - 16);
    const decipher = crypto.createDecipheriv(this.ALGORITHM, new Uint8Array(sharedKey), new Uint8Array(iv));
    decipher.setAuthTag(new Uint8Array(authTag));
    return Buffer.concat([
      new Uint8Array(decipher.update(new Uint8Array(encrypted))),
      new Uint8Array(decipher.final()),
    ]).toString('utf-8');
  }
}

// const aliceUtil = new ECDHUtil();
// const bobUtil = new ECDHUtil();

// aliceUtil.ecdh.generateKeys();
// bobUtil.ecdh.generateKeys();

// const message = 'Hello, Bob!';
// const encryptedMessage = aliceUtil.encrypt(message, bobUtil.ecdh.getPublicKey());
// console.log('Encrypted Message:', encryptedMessage);

// const decryptedMessage = bobUtil.decrypt(encryptedMessage, aliceUtil.ecdh.getPublicKey());
// console.log('Decrypted Message:', decryptedMessage);

import * as crypto from 'node:crypto';

export class ECDHUtil {
  protected readonly ALGORITHM: crypto.CipherGCMTypes = 'aes-256-gcm';
  protected readonly ecdh = crypto.createECDH('secp256k1');

  public constructor(protected readonly privateKey: Buffer) {
    this.ecdh.setPrivateKey(new Uint8Array(privateKey));
  }

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

// const alice = crypto.createECDH('secp256k1');
// const bob = crypto.createECDH('secp256k1');

// alice.generateKeys();
// bob.generateKeys();

// const aliceUtil = new ECDHUtil(alice.getPrivateKey());
// const bobUtil = new ECDHUtil(bob.getPrivateKey());

// const message = 'Hello, Bob!';
// const encryptedMessage = aliceUtil.encrypt(message, bob.getPublicKey());
// console.log('Encrypted Message:', encryptedMessage);

// const decryptedMessage = bobUtil.decrypt(encryptedMessage, alice.getPublicKey());
// console.log('Decrypted Message:', decryptedMessage);

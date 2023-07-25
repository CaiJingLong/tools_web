export interface RSAKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export async function generateRSAKeyPair(bits: number): Promise<RSAKeyPair> {
  //   const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  //     modulusLength: bits,
  //     publicKeyEncoding: {
  //       type: 'spki',
  //       format: 'pem',
  //     },
  //     privateKeyEncoding: {
  //       type: 'pkcs8',
  //       format: 'pem',
  //     },
  //   });
  //   return { publicKey, privateKey };

  const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: bits,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' },
    },
    true,
    ['encrypt', 'decrypt'],
  );

  return { publicKey, privateKey };
}

export async function exportRSAPublicKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('spki', key);
  return Buffer.from(exported).toString('base64');
}

export async function exportRSAPrivateKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('pkcs8', key);
  return Buffer.from(exported).toString('base64');
}

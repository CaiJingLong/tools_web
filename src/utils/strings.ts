import CryptoJS from 'crypto-js';

export function join(...args: string[]): string {
  return args.join('/');
}

export function inlineText(text: string): string {
  let result = text.replaceAll('\n', ' ');
  while (result.includes('  ')) {
    result = result.replaceAll('  ', ' ');
  }
  return result;
}

export function formatConfigurations(text: string): string {
  let result = inlineText(text);

  return result.replaceAll(' -', ' \\\n    -');
}

export function base64Encode(text: string): string {
  return Buffer.from(text).toString('base64');
}

export function base64Decode(text: string): string {
  return Buffer.from(text, 'base64').toString('utf8');
}

export function hexEncode(text: string): string {
  return Buffer.from(text).toString('hex');
}

export function hexDecode(text: string): string {
  return Buffer.from(text, 'hex').toString('utf8');
}

export function urlEncode(text: string): string {
  return encodeURIComponent(text);
}

export function urlDecode(text: string): string {
  return decodeURIComponent(text);
}

export function md5Encode(text: string): string {
  return CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);
}

export function sha1Encode(text: string): string {
  return CryptoJS.SHA1(text).toString(CryptoJS.enc.Hex);
}

export function sha256Encode(text: string): string {
  return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
}

export function sha512Encode(text: string): string {
  return CryptoJS.SHA512(text).toString(CryptoJS.enc.Hex);
}

export function sha3Encode(text: string): string {
  return CryptoJS.SHA3(text).toString(CryptoJS.enc.Hex);
}

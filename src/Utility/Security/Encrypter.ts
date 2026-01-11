import type {IEncrypter} from "./IEncrypter.ts";
import { gcmsiv } from "@noble/ciphers/aes.js";
import {hexToBytes, bytesToHex, bytesToUtf8, utf8ToBytes, randomBytes, type Cipher} from "@noble/ciphers/utils.js";

const NONCE_LENGTH = 12; //Length of the Nonce in Bytes
const SEPARATOR = " "; // Symbol that separates the Nonce and ciphertext. Should never be a symbol in hex

/**
 * Class used to encrypt and decrypt String with a key via AES-GCM-SIV through the noble-cipher library.
 * @author urnzq
 */
export class Encrypter implements IEncrypter{
    decrypt(ciphertext: string, key: Uint8Array): string {
        const splitCipher: string[] = ciphertext.split(SEPARATOR);
        const nonce: Uint8Array<ArrayBufferLike> = hexToBytes(splitCipher[0]);
        const pureCipher: Uint8Array<ArrayBufferLike> = hexToBytes(splitCipher[1]);
        const cipher: Cipher = gcmsiv(key, nonce);
        return bytesToUtf8(cipher.decrypt(pureCipher));
    }
    encrypt(plaintext: string, key: Uint8Array): string {
        const nonce: Uint8Array<ArrayBufferLike> = randomBytes(NONCE_LENGTH);
        const cipher: Cipher = gcmsiv(key, nonce);
        const encrypted: Uint8Array<ArrayBufferLike> = cipher.encrypt(utf8ToBytes(plaintext));
        return bytesToHex(encrypted) + SEPARATOR + bytesToHex(nonce);
    }
}
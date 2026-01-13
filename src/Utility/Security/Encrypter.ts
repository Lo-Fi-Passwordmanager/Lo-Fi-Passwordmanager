import type {IEncrypter} from "./IEncrypter.ts";
import { gcmsiv } from "@noble/ciphers/aes.js";
import {hexToBytes, bytesToHex, bytesToUtf8, utf8ToBytes, randomBytes, type Cipher} from "@noble/ciphers/utils.js";
import {DecryptionError} from "./DecryptionError.ts";

const NONCE_LENGTH = 12; //Length of the Nonce in Bytes
const SEPARATOR = " "; // Symbol that separates the Nonce and ciphertext. Should never be a symbol in hex

/**
 * Class used to encrypt and decrypt String with a key via AES-GCM-SIV through the noble-cipher library.
 * @author urnzq
 */
export class Encrypter implements IEncrypter{
    /**
     * Method to decrypt a string with a key via AES-GCM-SIV. Throws a decryption Error if decryption fails.
     * @param ciphertext the hex string you want to decrypt. Should consist of the encrypted value and a nonce
     * @param key a Uint8Array of length 32 used as the key for decryption
     * @returns the decrypted string
     */
    decrypt(ciphertext: string, key: Uint8Array): string {
        const splitCipher: string[] = ciphertext.split(SEPARATOR);
        const pureCipher: Uint8Array<ArrayBufferLike> = hexToBytes(splitCipher[0]);
        const nonce: Uint8Array<ArrayBufferLike> = hexToBytes(splitCipher[1]);
        const cipher: Cipher = gcmsiv(key, nonce);
        let result: Uint8Array<ArrayBufferLike>;
        try {
            result = cipher.decrypt(pureCipher);
        } catch {
            throw DecryptionError;
        }
        return bytesToUtf8(result);
    }
    /**
     * Method to encrypt a string with a key via AES-GCM-SIV.
     * @param plaintext the string you want to encrypt
     * @param key a Uint8Array of length 32 used as the key for encryption
     * @returns a hex string consisting of the encrypted value a hex, a space, then the nonce as hex
     */
    encrypt(plaintext: string, key: Uint8Array): string {
        const nonce: Uint8Array<ArrayBufferLike> = randomBytes(NONCE_LENGTH);
        const cipher: Cipher = gcmsiv(key, nonce);
        const encrypted: Uint8Array<ArrayBufferLike> = cipher.encrypt(utf8ToBytes(plaintext));
        return bytesToHex(encrypted) + SEPARATOR + bytesToHex(nonce);
    }
}
import type {IEncrypter} from "./IEncrypter.ts";
import { gcmsiv } from "@noble/ciphers/aes.js";
import {hexToBytes, bytesToHex, bytesToUtf8, utf8ToBytes, randomBytes} from "@noble/ciphers/utils.js";

const NONCE_LENGTH = 12; //Length of the Nonce in Bytes
const SEPARATOR = " ";

export class Encrypter implements IEncrypter{
    decrypt(ciphertext: string, key: Uint8Array): string {
        const splitCipher = ciphertext.split(" ");
        const nonce = hexToBytes(splitCipher[0]);
        const pureCipher = hexToBytes(splitCipher[1]);
        const cipher = gcmsiv(key, nonce);
        return bytesToUtf8(cipher.decrypt(pureCipher));
    }

    encrypt(plaintext: string, key: Uint8Array): string {
        const nonce = randomBytes(NONCE_LENGTH);
        const cipher = gcmsiv(key, nonce);
        const encrypted = cipher.encrypt(utf8ToBytes(plaintext));
        return bytesToHex(encrypted) + SEPARATOR + bytesToHex(nonce);
    }
}
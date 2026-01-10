import type {IKeyGen} from './IKeyGen.ts';
import {scrypt} from "@noble/hashes/scrypt.js";
import {randomBytes} from "@noble/ciphers/utils.js";

const SALT_LENGTH = 32;
const VALIDATION_LENGTH = 32;

export class KeyGen implements IKeyGen{
    generateKey(Password: string, Salt: Uint8Array): Uint8Array {
        return scrypt(Password, Salt, { N: 2**18, r: 8, p: 1, dkLen: 32 });
    }

    getNewSalt(): Uint8Array {
        return randomBytes(SALT_LENGTH);
    }

    getNewValidation(): Uint8Array {
        return randomBytes(VALIDATION_LENGTH);
    }
}
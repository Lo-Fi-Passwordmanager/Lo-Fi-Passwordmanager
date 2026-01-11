import type {IKeyGen} from './IKeyGen.ts';
import {scrypt} from "@noble/hashes/scrypt.js";
import {randomBytes} from "@noble/ciphers/utils.js";

const SALT_LENGTH = 32; //Length in Bytes of the Salt used to derive the Key from the password.
const VALIDATION_LENGTH = 32; //Length in Bytes of the Validation used for Login

/**
 * Class used to implement Methods connected to Key Derivation with help of the noble ciphers library.
 * @author urnzq
 */
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
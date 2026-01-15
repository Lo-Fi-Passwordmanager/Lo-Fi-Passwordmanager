import type {IKeyGen} from './IKeyGen.ts';
import {scrypt} from "@noble/hashes/scrypt.js";
import {randomBytes} from "@noble/ciphers/utils.js";

const SALT_LENGTH = 32; //Length in Bytes of the Salt used to derive the Key from the password.
const VALIDATION_LENGTH = 32; //Length in Bytes of the Validation used for Login
const SCRYPT_N: number = 2**15; //Work factor that should be modified //TODO wieder auf 2^18
const SCRYPT_R: number = 8; //Work factor that should stay at 8.
const SCRYPT_P: number = 1; //should always be 1 since parallelization is not implemented in scrypt.
const KEY_LENGTH: number = 32; //length of the Key derived

/**
 * Class used to implement Methods connected to Key Derivation with help of the noble ciphers library.
 * @author urnzq
 */
export class KeyGen implements IKeyGen{
    generateKey(Password: string, Salt: Uint8Array): Uint8Array {
        return scrypt(Password, Salt, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, dkLen: KEY_LENGTH });
    }

    getNewSalt(): Uint8Array {
        return randomBytes(SALT_LENGTH);
    }

    getNewValidation(): Uint8Array {
        return randomBytes(VALIDATION_LENGTH);
    }
}
import type {IEncrypter} from "./IEncrypter.ts";
import {Encrypter} from "./Encrypter.ts";
import type {IKeyGen} from "./IKeyGen.ts";
import {KeyGen} from "./KeyGen.ts";
import {bytesToHex, hexToBytes} from "@noble/ciphers/utils.js"
import {NoKeyError} from "./NoKeyError.ts";

const NO_KEY_DECRYPTION_MSG = "A decryption has been attempted but no key has been found";
const NO_KEY_ENCRYPTION_MSG = "An encryption has been attempted but no key has been found";


/**
 * Facade that implements all Functions needed for the Password-Managers Security.
 * @author urnzq
 */
export class SecurityProvider {
    #key: Uint8Array<ArrayBufferLike> | null;

    protected readonly encrypter: IEncrypter;
    protected readonly keyGen: IKeyGen;

    /**
     * Constructor for the SecurityProvider.
     */
    constructor() {
        this.encrypter = new Encrypter
        this.keyGen = new KeyGen;
        this.#key = null;
    }

    /**
     * Method to generate a new Salt when creating a Database
     * @return a string containing the Salt in Hex
     */
    getNewSalt(): string{
        return bytesToHex(this.keyGen.getNewSalt());
    }
    /**
     * Method to generate a new Validation for a Database and at the same time assign the key to the SecurityProvider.
     * @param Password the master password intended for this database
     * @param Salt the corresponding salt
     * @return a randomly generated value that was encrypted with a key derived the password and salt
     */
    getNewValidation(Password: string, Salt: string): string {
        this.#key = this.keyGen.generateKey(Password, hexToBytes(Salt));
        return this.encryptValue(bytesToHex(this.keyGen.getNewValidation()));
    }
    /**
     * Method to verify the Users Master password and assign the key to the SecurityProvider.
     * @param Password the users master password
     * @param Salt the salt of the database that the user is attempting to log into
     * @param Validation the validation of the database that the user is attempting to log into
     */
    verifyMasterPassword(Password: string, Salt: string, Validation: string): boolean {
        this.#key = this.keyGen.generateKey(Password, hexToBytes(Salt));
        const decryptedValidation: string | null = this.decryptValue(Validation)
        return decryptedValidation != null;
    }
    /**
     * Method to decrypt a Value of the Password Manager
     * @param Value a string
     * @return a string containing the nonce and the encrypted value seperated by a space;
     */
    encryptValue(Value: string): string {
        if (this.#key == null) {
            throw new NoKeyError(NO_KEY_ENCRYPTION_MSG);
        }
        return this.encrypter.encrypt(Value, this.#key)
    }

    /**
     * Method to decrypt a Value of the Password Manager.
     * If the decryption fails null is return and the decryption error is logged.
     * @param Value a string of Hex
     * @return the decrypted value or null if decryption failed
     */
    decryptValue(Value: string): string | null{
        if (this.#key == null) {
            throw new NoKeyError(NO_KEY_DECRYPTION_MSG);
        }
        let result: string | null = null;
        try {
            result = this.encrypter.decrypt(Value, this.#key)
        } catch (err) {
            console.error((err as Error).message)
        }
        return result;
    }

    /**
     * Method to set the key to null.
     * Intended for when the user logs out.
     */
    clearKey(): void {
        this.#key = null;
    }
}
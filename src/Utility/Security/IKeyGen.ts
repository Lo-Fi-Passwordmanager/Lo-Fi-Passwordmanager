/**
 * Interface that defines the methods expected by the SecurityProvider for Key Generation
 * @author urnzq
 */
export interface IKeyGen {
    /**
     * Method that generates a new Salt to derive a key from.
     */
    getNewSalt(): Uint8Array;

    /**
     * Method that generates a new validation in Bytes for the SecurityProvider
     */
    getNewValidation(): Uint8Array;

    /**
     * Method to derive a key from a password and a salt
     * @param Password the users password
     * @param Salt the salt from the database
     */
    generateKey(Password: string, Salt: Uint8Array): Uint8Array;
}
/**
 * Interface that defines the methods expected by the SecurityProvider for Encrypters.
 * @author urnzq
 */
export interface IEncrypter {
    /**
     * Encrypts a string with AES-GCM-SIV
     * @param plaintext that will be encrypted
     * @param key the used for this encryption
     */
    encrypt(plaintext: string, key: Uint8Array): string;
    /**
     * Decrypts a string via AES-GCM-SIV
     * @param ciphertext the encrypted string
     * @param key the key for decryption
     */
    decrypt(ciphertext: string, key: Uint8Array): string;
}
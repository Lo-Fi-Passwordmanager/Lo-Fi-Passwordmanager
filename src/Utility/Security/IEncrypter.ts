export interface IEncrypter {
    encrypt(plaintext: string, key: Uint8Array): string;
    decrypt(ciphertext: string, key: Uint8Array): string;
}
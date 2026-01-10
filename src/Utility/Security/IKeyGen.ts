export interface IKeyGen {
    getNewSalt(): Uint8Array;
    getNewValidation(): Uint8Array;
    generateKey(Password: string, Salt: Uint8Array): Uint8Array;
}
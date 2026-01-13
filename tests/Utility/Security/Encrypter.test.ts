import {expect, it, describe, beforeEach, afterEach} from "vitest";
import {Encrypter} from "../../../src/Utility/Security/Encrypter";
import {KeyGen} from "../../../src/Utility/Security/KeyGen";

const SAMPLE_PASSWORD = "c9630f85f51504761aef055c9e1b543c59e";
const SAMPLE_VALUE = "thisIsUsedForTesting"
const ENCRYPTED_PATTERN = /^[0-9a-fA-F]+\s[0-9a-fA-F]{24}$/;
let key: Uint8Array<ArrayBufferLike>;


describe('Encrypter', () => {
    let encrypter: Encrypter;

    beforeEach(() => {
        encrypter = new Encrypter();
        const keyGen = new KeyGen();
        key = keyGen.generateKey(SAMPLE_PASSWORD ,keyGen.getNewSalt())
    })

    afterEach(() => {
        encrypter = null;
    })

    it('should be able to encrypt a value', () => {
        expect(encrypter.encrypt(SAMPLE_VALUE, key)).toMatch(ENCRYPTED_PATTERN);
    })

    it('should be able to decrypt a value',() => {
        expect(encrypter.decrypt(encrypter.encrypt(SAMPLE_VALUE, key), key)).toBe(SAMPLE_VALUE);
    })
})
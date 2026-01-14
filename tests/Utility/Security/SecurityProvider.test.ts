import {SecurityProvider} from "../../../src/Utility/Security/SecurityProvider";
import {expect, it, describe, beforeEach, afterEach} from "vitest";

const SALT_PATTERN = /^[0-9a-fA-F]{64}$/;
const ENCRYPTED_PATTERN = /^[0-9a-fA-F]+\s[0-9a-fA-F]{24}$/;
const SAMPLE_PASSWORD = "superSecretPasswordNoOneCouldEverGuess";
const SAMPLE_WRONG_PASSWORD = "wrrrrongggaiofhofuaoi"
const SAMPLE_SALT = "a5391fb1173c9630f85f51504761aef055c9e1b543c59e6873ff3e283f5c30bf";

describe('SecurityProvider', () => {
    let securityProvider: SecurityProvider;

    beforeEach(() => {
        securityProvider = new SecurityProvider();
    })

    afterEach(() => {
        securityProvider = null;
    })

    it('should generate a new Salt', () => {
        expect(securityProvider.getNewSalt()).toMatch(SALT_PATTERN);
    })

    it('should generate a Validation from a password and a salt', () => {
        expect(securityProvider.getNewValidation(SAMPLE_PASSWORD, securityProvider.getNewSalt())).toMatch(ENCRYPTED_PATTERN);
    })

    it('should be able to confirm a MasterPassword', () => {
        const validation = securityProvider.getNewValidation(SAMPLE_PASSWORD, SAMPLE_SALT)
        expect(securityProvider.verifyMasterPassword(SAMPLE_PASSWORD, SAMPLE_SALT, validation)).toBe(true);
    })

    it('should reject a wrong password', () => {
        const validation = securityProvider.getNewValidation(SAMPLE_PASSWORD, SAMPLE_SALT);
        expect(securityProvider.verifyMasterPassword(SAMPLE_WRONG_PASSWORD, SAMPLE_SALT, validation)).toBe(false);
    })

    it('should be able to encrypt', () => {
        const validation = securityProvider.getNewValidation(SAMPLE_PASSWORD, SAMPLE_SALT)
        expect(securityProvider.verifyMasterPassword(SAMPLE_PASSWORD, SAMPLE_SALT, validation)).toBe(true);
        expect(securityProvider.encryptValue("test")).toMatch(ENCRYPTED_PATTERN);

    })

    it('should be able to decrypt', () => {
        const validation = securityProvider.getNewValidation(SAMPLE_PASSWORD, SAMPLE_SALT)
        expect(securityProvider.verifyMasterPassword(SAMPLE_PASSWORD, SAMPLE_SALT, validation)).toBe(true);
        const encrypted = securityProvider.encryptValue("test");
        expect(securityProvider.decryptValue(encrypted)).toBe("test");
    })

    it('should be able to clear the Key',() => {
        const validation = securityProvider.getNewValidation(SAMPLE_PASSWORD, SAMPLE_SALT)
        expect(securityProvider.verifyMasterPassword(SAMPLE_PASSWORD, SAMPLE_SALT, validation)).toBe(true);
        const encrypted = securityProvider.encryptValue("test");
        securityProvider.clearKey();
        let error = null;
        try {
            securityProvider.encryptValue((encrypted));
        } catch (err) {
            error = err;
        }
        expect(error != null);
        error = null;
        try {
            securityProvider.decryptValue((encrypted));
        } catch (err) {
            error = err;
        }
        expect(error != null);

    })
})
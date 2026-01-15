import {expect, it, describe, beforeEach, afterEach} from "vitest";
import {KeyGen} from "../../../src/Utility/Security/KeyGen";

const SALT_LENGTH = 32; //Length in Bytes of the Salt used to derive the Key from the password.
const VALIDATION_LENGTH = 32; //Length in Bytes of the Validation used for Login
const KEY_LENGTH = 32;
const SAMPLE_PASSWORD = "351(&§!BHIDB(!TGNDOAnfioz718210(HBV";

describe('KeyGen', ()=> {
    let keyGen: KeyGen;

    beforeEach(() => {
        keyGen = new KeyGen();
    })

    afterEach(() => {
        keyGen = null;
    })

    it('should be able to generate a Salt as a Uint8Array', () => {
        expect(keyGen.getNewSalt()).toBeInstanceOf(Uint8Array);
        expect(keyGen.getNewSalt().length).toBe(SALT_LENGTH);
    })

    it('should be able to generate a Validation as a Uint8Array', () => {
        expect(keyGen.getNewValidation()).toBeInstanceOf(Uint8Array);
        expect(keyGen.getNewValidation().length).toBe(VALIDATION_LENGTH);
    })

    it('should be able to derive a Key from a Password and Salt', () => {
        const key = keyGen.generateKey(SAMPLE_PASSWORD, keyGen.getNewSalt());
        expect(key).toBeInstanceOf(Uint8Array);
        expect(key.length).toBe(KEY_LENGTH);
    })
})
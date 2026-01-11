import {SecurityProvider} from "../../../src/Utility/Security/SecurityProvider";
import {expect, it, describe, beforeEach} from "vitest";

const SALT_PATTERN = /^[0-9A-F]{32}$/;

describe('SecurityProvider', () => {
    let securityProvider: SecurityProvider;

    beforeEach(() => {
        securityProvider = new SecurityProvider();
    })

    it('should generate a new Salt', () => {
        expect(securityProvider.getNewSalt().match(SALT_PATTERN));
    })

    it('should generate a Validation from a password and a salt', () => {

    })


})
import {expect, it, describe} from "vitest";
import {
    generatePassword,
    LOWER_CASE_LETTERS,
    NUMBERS,
    SPECIAL,
    UPPER_CASE_LETTERS
} from "../../src/Utility/PasswordGenerator";

const PASSWORD_LENGTH = 20;

const characters = [UPPER_CASE_LETTERS, LOWER_CASE_LETTERS, NUMBERS, SPECIAL]
const concatChars = characters.concat();


describe('PasswordGenerator', () => {
    it('should be able to generate a Password', () => {
        const password = generatePassword(PASSWORD_LENGTH, characters);
        expect(password.length).toBe(PASSWORD_LENGTH);
        const letters = password.split("")
        for (const s in letters){
            expect(concatChars.includes(s));
        }
    })
})
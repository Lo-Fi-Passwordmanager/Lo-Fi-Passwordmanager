import {expect, it, describe} from "vitest";
import {
    generatePassword,
    LOWER_CASE_LETTERS,
    NUMBERS,
    SPECIAL,
    UPPER_CASE_LETTERS
} from "../../src/Utility/PasswordGenerator";

const PASSWORD_LENGTH = 40;

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
    });

    it('should not check for character set when the password is too short', () => {
        const password = generatePassword(3, characters);
        expect(password.length).toBe(3);
    });

    //short password since it will have to nearly always do multiple loops until it includes all sets
    it('should always contain all selected character sets', ()=> {
        const password = generatePassword(4, characters);
        expect(password.length).toBe(4);
        const letters = password.split("")
        for (const s in letters){
            expect(concatChars.includes(s));
        }
    })
})
export const UPPER_CASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
export const NUMBERS = "0123456789";
export const SPECIAL = "!@$%^&*()<>,?/[]{}-=_+"

/**
 * Method to generate a secure Password from a set of Strings
 * @param length the passwords length
 * @param characters the sets of characters the password should consist of
 */
export function generatePassword(length: number, characters: string[]): string {
    let result: string = "";
    const chars: string[] = characters.join("").split(""); //Joins all strings into one, then splits it into individual chars
    const offset = 255 - (255 % chars.length);
    while (true) {
        while (result.length < length) {
            const randomNumber = crypto.getRandomValues(new Uint8Array(1))
            if (randomNumber[0] >= offset) {
                continue;
            }
            const thisChar = chars[randomNumber[0] % chars.length];
            result += (thisChar);
        }
        if(validPassword(result, length, characters)) {
            break;
        } else {
            result = "";
        }
    }
    return result;
}

function validPassword(password: string, length: number, characters: string[]): boolean {
    //prevents getting stuck in an inf loop
    if(length < characters.length) {
        return true;
    }
    for(const char of characters) {
        if(!passwordContainsChar(password, char)) {
            return false;
        }
    }
    return true;
}

function passwordContainsChar(password: string, characters: string): boolean {
    const char: string[] = characters.split("");
    for (const letter of char) {
        if(password.includes(letter)){
            return true;
        }
    }
    return false;
}


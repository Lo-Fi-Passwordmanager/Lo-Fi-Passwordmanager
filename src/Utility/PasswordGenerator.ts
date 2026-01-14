export const UPPER_CASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
export const NUMBERS = "0123456789";
export const SPECIAL = "!@$%^&*()<>,?/[]{}-=_+"

export function generatePassword(length: number, characters: string[]): string {
    let result: string = "";
    const joinedChars = characters.join("")
    const chars: string[] = joinedChars.split("");
    const offset = 255 - (255 % chars.length);
    while (result.length < length) {
        const randomNumber = crypto.getRandomValues(new Uint8Array(1))
        if (randomNumber[0] >= offset) {
            continue;
        }
        const thisChar = chars[randomNumber[0] % chars.length];
        result += (thisChar);
    }
    return result;
}

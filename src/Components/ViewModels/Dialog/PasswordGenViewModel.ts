import {useState} from "react";

import {
    generatePassword,
    LOWER_CASE_LETTERS,
    NUMBERS,
    SPECIAL,
    UPPER_CASE_LETTERS
} from "../../../Utility/PasswordGenerator.ts";
import {useToast} from "../Provider/ToastProviderViewModel.ts";

export interface PasswordGenDialogProps {
    setNewPassword: (password: string) => void;
}

/**
 * The Viewmodel for {@link PasswordGenDialog}
 * @param setNewPassword the function that writes the generated password into the correct field of the item
 */
export const usePasswordGenViewModel = (setNewPassword: (password: string) => void) => {

    const [length, setLength] = useState("20");
    const [uppercase, setUppercase] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [special, setSpecial] = useState(true);
    const [passwordGenOpen, setPasswordGenOpen] = useState(false);

    const [showToast, _] = useToast();

    function handleConfirm() {
        if(!uppercase && !lowercase && !numbers && !special) {
            showToast("Keine Zeichengruppe ausgewählt!");
            return;
        }
        const characters: string[] = getCharacters(uppercase, lowercase, numbers, special);
        setNewPassword(generatePassword(Number(length), characters));
        setPasswordGenOpen(false);
    }

    function getCharacters(uppercase: boolean, lowercase: boolean, numbers: boolean, special: boolean): string[] {
        const result: string[] = [];
        if(uppercase) {
            result.push(UPPER_CASE_LETTERS)
        }
        if(lowercase) {
            result.push(LOWER_CASE_LETTERS)
        }
        if(numbers) {
            result.push(NUMBERS)
        }
        if(special) {
            result.push(SPECIAL)
        }
        return result;
    }

    function toggleUppercase() {
        setUppercase(!uppercase);
    }

    function toggleLowercase() {
        setLowercase(!lowercase);
    }

    function toggleNumbers() {
        setNumbers(!numbers);
    }

    function toggleSpecial() {
        setSpecial(!special);
    }

    return {
        length,
        uppercase,
        lowercase,
        numbers,
        special,
        passwordGenOpen,
        setLength,
        toggleUppercase,
        toggleLowercase,
        toggleNumbers,
        toggleSpecial,
        handleConfirm,
        setPasswordGenOpen,
    }
}
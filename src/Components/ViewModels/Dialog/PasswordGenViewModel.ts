import {useState} from "react";
import {
    generatePassword,
    LOWER_CASE_LETTERS,
    NUMBERS,
    SPECIAL,
    UPPER_CASE_LETTERS
} from "../../../Utility/PasswordGenerator.ts";

export interface PasswordGenDialogProps {
    newPassword: (password: string) => void;
}

export const usePasswordGenViewModel = (newPassword: (password: string) => void) => {

    const [length, setLength] = useState("20");
    const [uppercase, setUppercase] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [special, setSpecial] = useState(true);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [passwordGenOpen, setPasswordGenOpen] = useState(false);

    function handleConfirm() {
        if(!uppercase && !lowercase && !numbers && !special) {
            setToastMessage("Keine Zeichengruppe ausgewählt!");
            setToastVisible(true);
            return;
        }
        const characters: string[] = getCharacters(uppercase, lowercase, numbers, special);
        newPassword(generatePassword(Number(length), characters));
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
        toastMessage,
        toastVisible,
        passwordGenOpen,

        setToastVisible,
        setToastMessage,
        setLength,
        toggleUppercase,
        toggleLowercase,
        toggleNumbers,
        toggleSpecial,
        handleConfirm,
        setPasswordGenOpen,
    }
}
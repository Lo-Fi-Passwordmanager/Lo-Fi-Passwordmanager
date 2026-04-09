import {useEffect, useState} from "react";
import {useToast} from "../Provider/ToastProviderViewModel.ts";


/**
 * The Viewmodel for {@link LoginDatabaseDialog}
 * @param isOpen a boolean for the visibility of the dialog, changing this triggers the fields to reset their values
 * @param tryOpenDatabase the function that tries to decrypt the selected Database with the password
 */
export const useLoginDatabaseViewModel = (isOpen: boolean,
                                          tryOpenDatabase: (field1: string) => void,
                                          ) => {

    const [field1, setField1] = useState("");
    const [showToast, _] = useToast()

    /**
     * Resets the input fields when the dialog is opened
     */
    useEffect(() => {
        if (isOpen) {
            setField1("");
        }
    }, [isOpen]);

    /**
     * Handles the confirm action
     */
    const handleConfirm = () => {
        if (!field1) {
            showToast("Bitte ein Passwort eingeben.");
            return;
        }
        tryOpenDatabase(field1);
    };

    return {
        field1,

        setField1,
        useEffect,
        handleConfirm,
    }
}
import {useEffect, useState} from "react";


/**
 * The Viewmodel for {@link LoginDatabaseDialog}
 * @param isOpen a boolean for the visibility of the dialog, changing this triggers the fields to reset their values
 * @param tryOpenDatabase the function that tries to decrypt the selected Database with the password
 * @param setToastMessage sets the message of the toast
 * @param setShowToast actually shows the toast
 */
export const useLoginDatabaseViewModel = (isOpen: boolean,
                                          tryOpenDatabase: (field1: string) => void,
                                          setToastMessage: (message: string) => void,
                                          setShowToast: (message: boolean) => void,
                                          ) => {

    const [field1, setField1] = useState("");

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
            setToastMessage("Bitte ein Password eingeben.");
            setShowToast(true);
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
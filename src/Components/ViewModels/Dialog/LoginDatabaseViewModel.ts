import {useEffect, useState} from "react";

export const useLoginDatabaseViewModel = (isOpen: boolean,
                                          onConfirm: (field1: string) => void,
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
        onConfirm(field1);
    };

    return {
        field1,

        setField1,
        useEffect,
        handleConfirm,
    }
}
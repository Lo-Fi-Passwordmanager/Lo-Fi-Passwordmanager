import {useEffect, useState} from "react";
import {isValidAutomergeUrl} from "@automerge/react";
import type {AutomergeUrl} from "@automerge/automerge-repo";

export interface TwoFieldDialogProps {
    isOpen: boolean,
    title: string,
    label1: string,
    label2: string,
    createDatabase: (field1: string, field2: string) => void,
    onCancel: () => void,
    storeDatabase: (name: string, autoMergeUrl: AutomergeUrl) => void
    setToastMessage: (message: string) => void,
    setShowToast: (show: boolean) => void,
}

export const useCreateDatabaseViewModel = (isOpen: boolean,
                                           createDatabase: ((field1: string, field2: string) => void),
                                           storeDatabase: (name: string, autoMergeUrl: AutomergeUrl) => void,
                                           setToastMessage: (message: string) => void,
                                           setShowToast: (show: boolean) => void,
) => {

    const [createNewDatabase, setCreateNewDatabase] = useState(true);
    const [field1, setField1] = useState("");
    const [field2, setField2] = useState("");

    /**
     * Resets the input fields when the dialog is opened
     */
    useEffect(() => {
        if (isOpen) {
            setField1("");
            setField2("");
        }
    }, [isOpen]);

    /**
     * Handles the confirm action based on the current mode (create new or import)
     *
     * @param createDatabase Function to create a new database
     * @param storeDatabase Function to store an existing database from URL
     */
    function handleConfirm() {
        if (!field1 || !field2) {
            setToastMessage("Bitte alle Felder ausfüllen.")
            setShowToast(true);
            return;
        }
        if (createNewDatabase) {
            createDatabase(field1, field2);
        } else {
            if (!isValidAutomergeUrl(("automerge:" + field2) as AutomergeUrl)) {
                setToastMessage("Keine valide AutomergeUrl.")
                setShowToast(true);
                return;
            }
            storeDatabase(field1, ("automerge:" + field2) as AutomergeUrl);
            return;
        }
    }

    return {
        createNewDatabase,
        field1,
        field2,

        handleConfirm,
        setField1,
        setField2,
        setCreateNewDatabase,
        useEffect,
    }
}

import {useEffect, useState} from "react";
import {isValidAutomergeUrl} from "@automerge/react";
import type {AutomergeUrl} from "@automerge/automerge-repo";

export const useCreateDatabaseViewModel = (isOpen: boolean,
                                           createDatabase: (field1: string, field2: string) => void,
                                           storeDatabase: (name: string, autoMergeUrl: AutomergeUrl) => void,
                                           setToastMessage: (message: string) => void,
                                           setShowToast: (show: boolean) => void,
                                           importDatabase: (targetFiles: (FileList | null), name: string) => void) => {

    //Valid states beeing, "new", "file" and "url"
    const [selectedImportType, setSelectedImportType] = useState("new");
    const [field1, setField1] = useState("");
    const [field2, setField2] = useState("");
    const [targetFiles, setTargetFiles] = useState<FileList | null>(null);

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
        if (selectedImportType === "file") {
            importDatabase(targetFiles, field1);
        } else {
            if (!field1 || !field2) {
                setToastMessage("Bitte alle Felder ausfüllen.")
                setShowToast(true);
                return;
            }
            if (selectedImportType === "new") {
                createDatabase(field1, field2);
            } else if (selectedImportType === "url") {
                if (!isValidAutomergeUrl(("automerge:" + field2) as AutomergeUrl)) {
                    setToastMessage("Keine valide AutomergeUrl.")
                    setShowToast(true);
                    return;
                }
                storeDatabase(field1, ("automerge:" + field2) as AutomergeUrl);
                return;
            }
        }
    }

    return {
        selectedImportType,
        field1,
        field2,
        targetFiles,

        setTargetFiles,
        handleConfirm,
        setField1,
        setField2,
        setSelectedImportType,
        useEffect,
    }
}

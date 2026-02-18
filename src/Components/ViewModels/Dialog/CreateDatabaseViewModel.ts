import type {AutomergeUrl} from "@automerge/automerge-repo";
import {isValidAutomergeUrl} from "@automerge/react";
import {useState} from "react";


/**
 * The Viewmodel for handling the {@link CreateDatabaseDialog} from the Login/Home Screen
 * @param isOpen a boolean that should be true, if the dialog should be shown. Changing this, triggers the fields to reset their values.
 * @param createDatabase the function to create the database with the given name and pasword
 * @param storeDatabase the function to store a database by its automergeurl
 * @param setToastMessage the functino to set the toast message
 * @param setShowToast the function to actually display the toast
 * @param importDatabase the function to import a database from a file
 */
export const useCreateDatabaseViewModel = (
    createDatabase: (name: string, password: string) => void,
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
                setToastMessage("Bitte alle Felder ausfüllen.");
                setShowToast(true);
                return;
            }
            if (selectedImportType === "new") {
                createDatabase(field1, field2);
            } else if (selectedImportType === "url") {
                if (!isValidAutomergeUrl(("automerge:" + field2) as AutomergeUrl)) {
                    setToastMessage("Keine valide AutomergeUrl.");
                    setShowToast(true);
                    return;
                }
                storeDatabase(field1, ("automerge:" + field2) as AutomergeUrl);
                return;
            }
        }
        setField1("");
        setField2("");
        setTargetFiles(null);
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
        setSelectedImportType
    };
};

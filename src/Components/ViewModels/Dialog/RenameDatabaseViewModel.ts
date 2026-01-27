import {useState} from "react";

export const useRenameDatabaseViewModel = (oldName: string, renameDatabase: (oldName: string, newName: string) => void) => {

    const [renameDatabaseOpen, setRenameDatabaseOpen] = useState(false);
    const [newName, setNewName] = useState(oldName);

    function handleConfirm() {
        renameDatabase(oldName, newName);
        setRenameDatabaseOpen(false);
    }

    return {
        renameDatabaseOpen,
        newName,
        setRenameDatabaseOpen,
        handleConfirm,
        setNewName,
    }
}
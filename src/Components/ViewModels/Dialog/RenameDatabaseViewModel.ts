import {useState} from "react";

/**
 * The Viewmodel for {@link RenameDatabaseDialog}
 * @param oldName the oldname, this is the name that will be set on cancellation/confirmation without changes
 * @param renameDatabase the functino that renames the database in the storage
 */
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
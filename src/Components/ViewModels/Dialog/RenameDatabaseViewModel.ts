import {useState} from "react";
import {renameDatabase} from "../../../Utility/Storage.ts";

export const useRenameDatabaseViewModel = (oldName: string) => {

    const [renameDatabaseOpen, setRenameDatabaseOpen] = useState(false);
    const [newName, setNewName] = useState("");

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
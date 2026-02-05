import React from "react";
import {useRenameDatabaseViewModel} from "../../ViewModels/Dialog/RenameDatabaseViewModel.ts";
import {HiPencil} from "react-icons/hi";
import Dialog from "./Dialog.tsx";

/**
 * A dialog that allows the user to rename a database.
 *
 * @param oldName The current name of the database.
 * @param renameDatabase Function to rename the database.
 */
const RenameDatabaseDialog: React.FC<{
    oldName: string;
    renameDatabase: (oldName: string, newName: string) => void;
}> = ({oldName, renameDatabase}) => {
    const viewModel = useRenameDatabaseViewModel(oldName, renameDatabase);

    if (viewModel.renameDatabaseOpen) {
        return (
            <>
            <button
                className="squareButton"
                onClick={() => viewModel.setRenameDatabaseOpen(true)}>
                <HiPencil size={24}/>
            </button>
            <Dialog title={"Datenbank umbenennen:"} onCloseDialog={() => viewModel.setRenameDatabaseOpen(false)}>
                    <input
                        type={"text"}
                        value={viewModel.newName}
                        onChange={(e) => viewModel.setNewName(e.target.value)}
                        autoFocus
                    />
                    <div className={"confirm-cancel-buttons"}>
                        <button className={"rectangle-button"} onClick={() => viewModel.handleConfirm()}>Bestätigen</button>
                        <button className={"rectangle-button"} onClick={() => viewModel.setRenameDatabaseOpen(false)}>Abbrechen</button>
                    </div>
                </Dialog>
            </>
        )
    } else {
        return (
            <button
                className="squareButton"
                onClick={() => viewModel.setRenameDatabaseOpen(true)}>
                <HiPencil size={24}/>
            </button>
        );
    }
}
export default RenameDatabaseDialog;
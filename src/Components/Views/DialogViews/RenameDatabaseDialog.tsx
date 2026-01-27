import React from "react";
import {useRenameDatabaseViewModel} from "../../ViewModels/Dialog/RenameDatabaseViewModel.ts";


interface RenameDatabaseDialogProps {
    oldName: string;
    renameDatabase: (oldName: string, newName: string) => void;
}

const RenameDatabaseDialog: React.FC<RenameDatabaseDialogProps> = ({oldName, renameDatabase}: RenameDatabaseDialogProps) => {
    const viewModel = useRenameDatabaseViewModel(oldName, renameDatabase);

    if (viewModel.renameDatabaseOpen) {
        return (
            <>
            <button
                className="renameDatabaseButton"
                onClick={() => viewModel.setRenameDatabaseOpen(true)}>✏️
            </button>
            <div className={"dialogOverlay"}>
                <div className={"dialog"}>
                    <h3>Datenbank umbenennen:</h3>
                    <input
                        type={"text"}
                        value={viewModel.newName}
                        onChange={(e) => viewModel.setNewName(e.target.value)}
                        autoFocus
                    />
                    <div className={"confirm-cancel-buttons"}>
                        <button onClick={() => viewModel.handleConfirm()}>Bestätigen</button>
                        <button onClick={() => viewModel.setRenameDatabaseOpen(false)}>Abbrechen</button>
                    </div>
                </div>
            </div>
            </>
        )
    } else {
        return (
            <button
                className="renameDatabaseButton"
                onClick={() => viewModel.setRenameDatabaseOpen(true)}>✏️
            </button>
        );
    }
}
export default RenameDatabaseDialog;
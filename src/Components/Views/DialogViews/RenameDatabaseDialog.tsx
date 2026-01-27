import React from "react";
import {useRenameDatabaseViewModel} from "../../ViewModels/Dialog/RenameDatabaseViewModel.ts";


interface RenameDatabaseDialogProps {
    oldName: string;
}

const RenameDatabaseDialog: React.FC<RenameDatabaseDialogProps> = ({oldName}: RenameDatabaseDialogProps) => {
    const viewModel = useRenameDatabaseViewModel(oldName);

    if (viewModel.renameDatabaseOpen) {
        return (
            <div className={"dialogOverlay"}>
                <div className={"dialog"}>
                    <h3>Datenbank umbenennen:</h3>
                    <input
                        type={"text"}
                        value={viewModel.newName}
                        onChange={(e) => viewModel.setNewName(e.target.value)}
                    />
                    <div className={"confirm-cancel-buttons"}>
                        <button onClick={() => viewModel.handleConfirm()}>Bestätigen</button>
                        <button onClick={() => viewModel.setRenameDatabaseOpen(false)}>Abbrechen</button>
                    </div>
                </div>
            </div>
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
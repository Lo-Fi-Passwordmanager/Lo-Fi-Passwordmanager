import React from "react";
import {useLoginDatabaseViewModel} from "../../ViewModels/Dialog/LoginDatabaseViewModel.ts";
import type {TwoFieldDialogProps} from "../../ViewModels/Dialog/LoginDatabaseViewModel.ts";
import Dialog from "./Dialog.tsx";


const LoginDatabaseDialog: React.FC<TwoFieldDialogProps> = ({
                                                                isOpen,
                                                                title,
                                                                label1,
                                                                onConfirm,
                                                                onCancel,
                                                                setToastMessage,
                                                                setShowToast

                                                            }) => {

    const viewModel = useLoginDatabaseViewModel(isOpen, onConfirm, setToastMessage, setShowToast);

    if (!isOpen) return null;

    return (
        <Dialog title={title} onCloseDialog={onCancel}>
            <label>{label1}</label>
            <input
                type="password"
                value={viewModel.field1}
                onChange={(e) => viewModel.setField1(e.target.value)}
                placeholder={label1}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        viewModel.handleConfirm();
                    }
                    if (e.key === 'Escape') {
                        onCancel();
                    }
                }}
            />

            <div className="confirm-cancel-buttons">
                <button onClick={viewModel.handleConfirm}>Bestätigen</button>
                <button onClick={onCancel}>Abbrechen</button>
            </div>
        </Dialog>
    );
};
export default LoginDatabaseDialog;
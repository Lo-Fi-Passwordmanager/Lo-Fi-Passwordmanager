import React from "react";
import {useLoginDatabaseViewModel} from "../../ViewModels/Dialog/LoginDatabaseViewModel.ts";
import type {TwoFieldDialogProps} from "../../ViewModels/Dialog/LoginDatabaseViewModel.ts";


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
        <div className="dialogOverlay">
            <div className="dialog">
                <h3>{title}</h3>
                <label>{label1}</label>
                <input
                    type="password"
                    value={viewModel.field1}
                    onChange={(e) => viewModel.setField1(e.target.value)}
                    placeholder={label1}
                    autoFocus
                />

                <div className="confirm-cancel-buttons">
                    <button onClick={viewModel.handleConfirm}>Bestätigen</button>
                    <button onClick={onCancel}>Abbrechen</button>
                </div>

            </div>
        </div>
    );
};
export default LoginDatabaseDialog;
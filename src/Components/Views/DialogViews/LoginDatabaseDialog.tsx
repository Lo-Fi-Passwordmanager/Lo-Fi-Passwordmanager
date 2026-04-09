import React from "react";

import Dialog from "./Dialog.tsx";
import {useLoginDatabaseViewModel} from "../../ViewModels/Dialog/LoginDatabaseViewModel.ts";
import EyeButton from "../ButtonViews/EyeButton.tsx";

/**
 * A dialog that asks the user to input credentials to log in to a database.
 *
 * @param isOpen Whether the dialog is open.
 * @param title The title of the dialog.
 * @param label1 The label for the first input field.
 * @param tryOpenDatabase Function to attempt to open the database with the provided credentials.
 * @param onCancel Function to call when the dialog is canceled.
 * @param hidePassword Whether to hide the password input.
 * @param toggleHidePassword Function to toggle the visibility of the password input.
 */
const LoginDatabaseDialog: React.FC<{
    isOpen: boolean,
    title: string,
    label1: string,
    tryOpenDatabase: (field1: string) => void,
    onCancel: () => void,
    hidePassword: boolean,
    toggleHidePassword: () => void,
}> = ({
          isOpen,
          title,
          label1,
          tryOpenDatabase,
          onCancel,
          hidePassword,
          toggleHidePassword
      }) => {

    const viewModel = useLoginDatabaseViewModel(isOpen, tryOpenDatabase);

    if (!isOpen) return null;

    return (
        <Dialog title={title} onCloseDialog={onCancel}>
            <label>{label1}</label>
            <div className={"password-container"}>
                <input
                    type={hidePassword ? "password" : "text"}
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
                <EyeButton hidePassword={hidePassword} toggleHidePassword={toggleHidePassword} size={49}/>
            </div>
            <div className="confirm-cancel-buttons">
                <button className={"rectangle-button"} onClick={viewModel.handleConfirm}>Bestätigen</button>
                <button className={"rectangle-button"} onClick={onCancel}>Abbrechen</button>
            </div>
        </Dialog>
    );
};
export default LoginDatabaseDialog;
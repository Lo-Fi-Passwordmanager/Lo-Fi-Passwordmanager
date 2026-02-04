import React from "react";
import {type PasswordGenDialogProps, usePasswordGenViewModel} from "../../ViewModels/Dialog/PasswordGenViewModel.ts";
import ToastDialog from "./ToastDialog.tsx";
import {HiMiniPlus} from "react-icons/hi2";
import Dialog from "./Dialog.tsx";

/**
 * A dialog that allows the user to generate a new password with specified criteria.
 *
 * @param setNewPassword Function to set the newly generated password.
 */
const PasswordGenDialog: React.FC<PasswordGenDialogProps> = ({setNewPassword}: PasswordGenDialogProps) => {
    const viewModel = usePasswordGenViewModel(setNewPassword);
    if (viewModel.passwordGenOpen) {
        return (
            <Dialog title={"Passwortgenerator"} onCloseDialog={() => viewModel.setPasswordGenOpen(false)}>
                <div className={"passwordGen"}>
                    <label>Passwort-Länge:</label>
                    <input

                        type="number"
                        value={viewModel.length}
                        onChange={(e) => viewModel.setLength(e.target.value)}
                        min="0"
                        max="100"
                        step="1"
                        autoFocus
                    />
                    <label>Großbuchstaben:</label>
                    <input
                        type="checkbox"
                        checked={viewModel.uppercase}
                        onChange={viewModel.toggleUppercase}
                    />
                    <label>Kleinbuchstaben:</label>
                    <input
                        type="checkbox"
                        checked={viewModel.lowercase}
                        onChange={viewModel.toggleLowercase}
                    />
                    <label>Zahlen:</label>
                    <input
                        type="checkbox"
                        checked={viewModel.numbers}
                        onChange={viewModel.toggleNumbers}
                    />
                    <label>Sonderzeichen:</label>
                    <input
                        type="checkbox"
                        checked={viewModel.special}
                        onChange={viewModel.toggleSpecial}
                    />
                </div>
                <div className="confirm-cancel-buttons">
                    <button onClick={viewModel.handleConfirm}>Bestätigen</button>
                    <button onClick={() => viewModel.setPasswordGenOpen(false)}>Abbrechen</button>
                </div>
                <ToastDialog message={viewModel.toastMessage}
                             isVisible={viewModel.toastVisible}
                             onClose={() => viewModel.setToastVisible(false)}>

                </ToastDialog>
            </Dialog>
        );
    } else {
        return (
            <button
                className="passwordGenButton"
                onClick={() => viewModel.setPasswordGenOpen(true)}>
                <HiMiniPlus size={24}/>
            </button>
        );
    }
}
export default PasswordGenDialog;
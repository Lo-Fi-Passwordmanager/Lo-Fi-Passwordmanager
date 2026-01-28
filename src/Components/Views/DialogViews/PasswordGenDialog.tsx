import React from "react";
import {type PasswordGenDialogProps, usePasswordGenViewModel} from "../../ViewModels/Dialog/PasswordGenViewModel.ts";
import ToastDialog from "./ToastDialog.tsx";



const PasswordGenDialog: React.FC<PasswordGenDialogProps> = ({newPassword}: PasswordGenDialogProps) => {
    const viewModel = usePasswordGenViewModel(newPassword);
    if (viewModel.passwordGenOpen) {
        return (
            <div className="dialogOverlay">
                <div className={"dialog"}>
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
                </div>
                <ToastDialog message={viewModel.toastMessage}
                             isVisible={viewModel.toastVisible}
                             onClose={() => viewModel.setToastVisible(false)}>

                </ToastDialog>
            </div>
        );
    } else {
        return (
            <button
                className="passwordGenButton"
                onClick={() => viewModel.setPasswordGenOpen(true)}>+
            </button>
        );
    }
}
export default PasswordGenDialog;
import React from "react";
import {type PasswordGenDialogProps, usePasswordGenViewModel} from "../../ViewModels/Dialog/PasswordGenViewModel.ts";



const PasswordGenDialog: React.FC<PasswordGenDialogProps> = ({newPassword, cancelPasswordGen}: PasswordGenDialogProps) => {
    const viewModel = usePasswordGenViewModel(newPassword!);

    return (
        <div className="dialogOverlay">
            <div className={"dialog"}>
                <div className={"passwordGen"}>

                    <label>Passwort-Länge:</label>
                    <input
                        className="inputField"
                        type="number"
                        value={viewModel.length}
                        onChange={(e) => viewModel.setLength(e.target.value)}
                        min="0"
                        max="100"
                        step="1"
                        placeholder={"20"}
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
                    <button onClick={cancelPasswordGen}>Abbrechen</button>
                </div>
            </div>
        </div>
    );
}
export default PasswordGenDialog;
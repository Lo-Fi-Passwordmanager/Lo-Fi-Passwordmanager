import React from "react";
import {HiMiniPlus} from "react-icons/hi2";

import Dialog from "./Dialog.tsx";
import {type PasswordGenDialogProps, usePasswordGenViewModel} from "../../ViewModels/Dialog/PasswordGenViewModel.ts";
import SliderCheckBox from "../ButtonViews/SliderCheckBox.tsx";
import {t} from "i18next";

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
                    <SliderCheckBox
                        checked={viewModel.uppercase}
                        toggleChecked={viewModel.toggleUppercase}
                        style={{justifySelf: "center"}}
                        />
                    <label>Kleinbuchstaben:</label>
                    <SliderCheckBox
                        checked={viewModel.lowercase}
                        toggleChecked={viewModel.toggleLowercase}
                        style={{justifySelf: "center"}}
                    />
                    <label>Zahlen:</label>
                    <SliderCheckBox
                        checked={viewModel.numbers}
                        toggleChecked={viewModel.toggleNumbers}
                        style={{justifySelf: "center"}}
                    />
                    <label>Sonderzeichen:</label>
                    <SliderCheckBox
                        checked={viewModel.special}
                        toggleChecked={viewModel.toggleSpecial}
                        style={{justifySelf: "center"}}
                    />
                </div>
                <div className="confirm-cancel-buttons">
                    <button className={"rectangle-button"} onClick={viewModel.handleConfirm}>{t("button.confirm")}</button>
                    <button className={"rectangle-button"} onClick={() => viewModel.setPasswordGenOpen(false)}>{t("button.cancel")}</button>
                </div>
            </Dialog>
        );
    } else {
        return (
            <button
                className="passwordGenButton"
                onClick={() => viewModel.setPasswordGenOpen(true)}
                title={"Passwort generieren"}
            >
                <HiMiniPlus size={24}/>
            </button>
        );
    }
}
export default PasswordGenDialog;
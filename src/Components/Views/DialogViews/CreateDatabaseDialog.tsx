import React from "react";
import {useCreateDatabaseViewModel} from "../../ViewModels/Dialog/CreateDatabaseViewModel.ts";
import Dialog from "./Dialog.tsx";
import EyeButton from "../ButtonViews/EyeButton.tsx";
import type {AutomergeUrl} from "@automerge/automerge-repo";
import QRScannerDialog from "./QRScannerDialog.tsx";

/**
 * A dialog that allows the user to create a new database or import an existing one.
 *
 * @param isOpen whether the dialog is open
 * @param title the title of the dialog
 * @param label1 the label for the first input field
 * @param label2 the label for the second input field
 * @param createDatabase method to create a new database
 * @param onCancel method to call when the dialog is cancelled
 * @param importDatabaseFromURL method to import a database from a URL
 * @param setToastMessage method to set the toast message
 * @param setShowToast method to show or hide the toast
 * @param importDatabaseFromFile method to import a database from a file
 * @param hidePassword whether the password is hidden
 * @param toggleHidePassword method to toggle the password visibility
 * @constructor
 */
const CreateDatabaseDialog: React.FC<{
    isOpen: boolean,
    title: string,
    label1: string,
    label2: string,
    createDatabase: (field1: string, field2: string) => void,
    onCancel: () => void,
    importDatabaseFromURL: (name: string, autoMergeUrl: AutomergeUrl) => void,
    setToastMessage: (message: string) => void,
    setShowToast: (show: boolean) => void,
    importDatabaseFromFile: (targetFiles: (FileList | null), name: string) => void
    hidePassword: boolean,
    toggleHidePassword: () => void,
}
> = ({
    isOpen,
    title,
    label1,
    label2,
    createDatabase,
    onCancel,
    importDatabaseFromURL,
    setToastMessage,
    setShowToast,
    importDatabaseFromFile,
    hidePassword,
    toggleHidePassword
}) => {

    const viewModel = useCreateDatabaseViewModel(isOpen, createDatabase, importDatabaseFromURL, setToastMessage, setShowToast, importDatabaseFromFile);

    if (!isOpen) return null;

    if (viewModel.selectedImportType === "new") {
        return (
            <Dialog title={title} onCloseDialog={onCancel}>
                <div className="dialogButtonContainer">
                    <button onClick={() => viewModel.setSelectedImportType("new")}>Neue Datenbank erstellen</button>
                    <button style={{color: "gray"}} onClick={() => viewModel.setSelectedImportType("url")}>Existierende
                                                                                                           Datenbank
                                                                                                           laden
                    </button>
                    <button style={{color: "gray"}} onClick={() => viewModel.setSelectedImportType("file")}>Datenbank
                                                                                                            importieren
                    </button>
                </div>

                <label>{label1}</label>
                <input
                    type="text"
                    value={viewModel.field1}
                    onChange={(e) => viewModel.setField1(e.target.value)}
                    placeholder={label1}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            viewModel.handleConfirm();
                        }
                        if (e.key === "Escape") {
                            onCancel();
                        }
                    }}
                />
                <label>{label2}</label>
                <div className={"password-container"}>
                    <input
                        type={hidePassword ? "password" : "text"}
                        value={viewModel.field2}
                        onChange={(e) => viewModel.setField2(e.target.value)}
                        placeholder={label2}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                viewModel.handleConfirm();
                            }
                            if (e.key === "Escape") {
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
    } else if (viewModel.selectedImportType === "url") {
        return (
            <Dialog title={title} onCloseDialog={onCancel}>
                <div className="dialogButtonContainer">
                    <button style={{color: "gray"}} onClick={() => viewModel.setSelectedImportType("new")}>Neue
                                                                                                           Datenbank
                                                                                                           erstellen
                    </button>
                    <button onClick={() => viewModel.setSelectedImportType("url")}>Existierende Datenbank laden
                    </button>
                    <button style={{color: "gray"}}
                            onClick={() => viewModel.setSelectedImportType("file")}>Datenbank importieren
                    </button>
                </div>
                <label>Name</label>
                <input
                    type="text"
                    value={viewModel.field1}
                    onChange={(e) => viewModel.setField1(e.target.value)}
                    placeholder={"Name"}
                    autoFocus
                />
                <label>Automerge Url</label>
                <div className="urlWrapper">
                    <input
                        type="text"
                        value={viewModel.field2}
                        onChange={(e) => viewModel.setField2(e.target.value)}
                        placeholder={"Automerge Url"}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                viewModel.handleConfirm();
                            }
                            if (e.key === "Escape") {
                                onCancel();
                            }
                        }}
                    />
                    <QRScannerDialog setInputFields={(name, url) => {
                        viewModel.setField1(name);
                        viewModel.setField2(url);
                    }}/>
                </div>
                <div className="confirm-cancel-buttons">
                    <button className={"rectangle-button"} onClick={viewModel.handleConfirm}>Bestätigen</button>
                    <button className={"rectangle-button"} onClick={onCancel}>Abbrechen</button>
                </div>
            </Dialog>
        );
    } else {
        return (
            <Dialog title={title} onCloseDialog={onCancel}>
                <div className="dialogButtonContainer">
                    <button style={{color: "gray"}} onClick={() => viewModel.setSelectedImportType("new")}>Neue
                                                                                                           Datenbank
                                                                                                           erstellen
                    </button>
                    <button style={{color: "gray"}}
                            onClick={() => viewModel.setSelectedImportType("url")}>Existierende Datenbank laden
                    </button>
                    <button onClick={() => viewModel.setSelectedImportType("file")}>Datenbank importieren</button>
                </div>
                <label>Name</label>
                <input
                    type="text"
                    value={viewModel.field1}
                    onChange={(e) => viewModel.setField1(e.target.value)}
                    placeholder={label1}
                    autoFocus
                />
                <label>Datei auswählen</label>
                <label htmlFor="file-upload" className="file-upload">
                    {viewModel.targetFiles === null || viewModel.targetFiles.length < 1 ? <span>Datei auswählen</span> :
                        <span className={"visible"}>{viewModel.targetFiles[0].name}</span>}
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".encpwdb"
                    style={{display: "none"}}
                    onChange={(event) => viewModel.setTargetFiles(event.target.files)}
                />

                <div className="confirm-cancel-buttons">
                    <button className={"rectangle-button"} onClick={viewModel.handleConfirm}>Bestätigen</button>
                    <button className={"rectangle-button"} onClick={onCancel}>Abbrechen</button>
                </div>
            </Dialog>
        );
    }

};
export default CreateDatabaseDialog;
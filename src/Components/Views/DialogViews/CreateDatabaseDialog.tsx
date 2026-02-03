import React from "react";
import {useCreateDatabaseViewModel} from "../../ViewModels/Dialog/CreateDatabaseViewModel.ts";
import Dialog from "./Dialog.tsx";
import EyeButton from "../ButtonViews/EyeButton.tsx";
import type {AutomergeUrl} from "@automerge/automerge-repo";
import QRScannerDialog from "./QRScannerDialog.tsx";

const CreateDatabaseDialog: React.FC<{
    isOpen: boolean,
    title: string,
    label1: string,
    label2: string,
    createDatabase: (field1: string, field2: string) => void,
    onCancel: () => void,
    storeDatabase: (name: string, autoMergeUrl: AutomergeUrl) => void,
    setToastMessage: (message: string) => void,
    setShowToast: (show: boolean) => void,
    importDatabase: (targetFiles: (FileList | null), name: string) => void
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
    storeDatabase,
    setToastMessage,
    setShowToast,
    importDatabase,
    hidePassword,
    toggleHidePassword
}) => {

    const viewModel = useCreateDatabaseViewModel(isOpen, createDatabase, storeDatabase, setToastMessage, setShowToast, importDatabase);

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
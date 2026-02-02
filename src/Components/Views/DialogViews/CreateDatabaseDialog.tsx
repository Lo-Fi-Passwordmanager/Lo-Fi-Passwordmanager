import React from "react";
import {
    type TwoFieldDialogProps,
    useCreateDatabaseViewModel
} from "../../ViewModels/Dialog/CreateDatabaseViewModel.ts";
import Dialog from "./Dialog.tsx";


const CreateDatabaseDialog: React.FC<TwoFieldDialogProps> = ({
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
                                                             }: TwoFieldDialogProps) => {

    const viewModel = useCreateDatabaseViewModel(isOpen, createDatabase, storeDatabase, setToastMessage, setShowToast, importDatabase);

    if (!isOpen) return null;

    if (viewModel.selectedImportType === "new") {
        return (
            <Dialog title={title} onCloseDialog={onCancel}>
                <div className="dialogButtonContainer">
                    <button onClick={() => viewModel.setSelectedImportType("new")}>Neue Datenbank erstellen</button>
                    <button style={{color: "gray"}} onClick={() => viewModel.setSelectedImportType("url")}>Existierende
                        Datenbank laden
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
                        if (e.key === 'Enter') {
                            viewModel.handleConfirm();
                        }
                        if (e.key === 'Escape') {
                            onCancel();
                        }
                    }}
                />
                <label>{label2}</label>
                <input
                    type="password"
                    value={viewModel.field2}
                    onChange={(e) => viewModel.setField2(e.target.value)}
                    placeholder={label2}
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
    } else if (viewModel.selectedImportType === "url") {
        return (
            <Dialog title={title} onCloseDialog={onCancel}>
                <div className="dialogButtonContainer">
                    <button style={{color: "gray"}} onClick={() => viewModel.setSelectedImportType("new")}>Neue
                        Datenbank erstellen
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
                <input
                    type="text"
                    value={viewModel.field2}
                    onChange={(e) => viewModel.setField2(e.target.value)}
                    placeholder={"Automerge Url"}
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
    } else {
        return (
            <Dialog title={title} onCloseDialog={onCancel}>
                <div className="dialogButtonContainer">
                    <button style={{color: "gray"}} onClick={() => viewModel.setSelectedImportType("new")}>Neue
                        Datenbank erstellen
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
                <input
                    type="file"
                    accept="*/*"
                    onChange={(event) => viewModel.setTargetFiles(event.target.files)}
                />
                <div className="confirm-cancel-buttons">
                    <button onClick={viewModel.handleConfirm}>Bestätigen</button>
                    <button onClick={onCancel}>Abbrechen</button>
                </div>
            </Dialog>
        );
    }

    }
    export default CreateDatabaseDialog;
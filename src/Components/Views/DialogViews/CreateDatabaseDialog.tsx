import type {AutomergeUrl} from "@automerge/automerge-repo";
import React from "react";
import {useTranslation} from "react-i18next";

import Dialog from "./Dialog.tsx";
import ShareDatabaseQRScannerDialog from "./ShareDatabaseQRScannerDialog.tsx";
import {useCreateDatabaseViewModel} from "../../ViewModels/Dialog/CreateDatabaseViewModel.ts";
import EyeButton from "../ButtonViews/EyeButton.tsx";

const CreateDatabaseDialog: React.FC<{
    isOpen: boolean,
    createDatabase: (field1: string, field2: string) => void,
    onCancel: () => void,
    importDatabaseFromURL: (name: string, autoMergeUrl: AutomergeUrl) => void,
    importDatabaseFromFile: (targetFiles: (FileList | null), name: string) => void
    hidePassword: boolean,
    toggleHidePassword: () => void,
    importUnencryptedDatabaseFromFile: (targetFiles: (FileList | null), name: string, password: string) => void
}> = ({
          isOpen,
          createDatabase,
          onCancel,
          importDatabaseFromURL,
          importDatabaseFromFile,
          hidePassword,
          toggleHidePassword,
          importUnencryptedDatabaseFromFile
      }) => {
    const viewModel = useCreateDatabaseViewModel(
        createDatabase,
        importDatabaseFromURL,
        importDatabaseFromFile,
        importUnencryptedDatabaseFromFile
    );


    const {t} = useTranslation('translation');

    if (!isOpen) return null;

    // Helper to handle enter/escape keys globally for the dialog
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") viewModel.handleConfirm();
        if (e.key === "Escape") onCancel();
    };

    return (
        <Dialog title={t("add_database.create_new.title")} onCloseDialog={onCancel}>
            {/* Dropdown Menu Replacement */}
            <div className="dialogDropdownContainer" style={{marginBottom: "20px"}}>
                <label htmlFor="import-type-select" style={{display: "block", marginBottom: "5px"}}>
                    {t("add_database.create_new.choose_action")}
                </label>
                <select
                    id="import-type-select"
                    value={viewModel.selectedImportType}
                    onChange={(e) => viewModel.setSelectedImportType(e.target.value)}
                    style={{width: "100%"}}
                >
                    <option value="new">{t("add_database.create_new.action.new")}</option>
                    <option value="url">{t("add_database.create_new.action.url")}</option>
                    <option value="file">{t("add_database.create_new.action.file_encrypted")}</option>
                    <option value="filedecrypt">{t("add_database.create_new.action.file_plain")}</option>
                </select>
            </div>

            {viewModel.selectedImportType === "new" && (
                <>
                    <label>{t("add_database.placeholder.name")}</label>
                    <input
                        type="text"
                        value={viewModel.field1}
                        onChange={(e) => viewModel.setField1(e.target.value)}
                        placeholder={t("add_database.placeholder.name")}
                        autoFocus
                        onKeyDown={handleKeyDown}
                    />
                    <label>{t("add_database.placeholder.password")}</label>
                    <div className={"password-container"}>
                        <input
                            type={hidePassword ? "password" : "text"}
                            value={viewModel.field2}
                            onChange={(e) => viewModel.setField2(e.target.value)}
                            placeholder={t("add_database.placeholder.password")}
                            onKeyDown={handleKeyDown}
                        />
                        <EyeButton hidePassword={hidePassword} toggleHidePassword={toggleHidePassword} size={49}/>
                    </div>
                </>
            )}

            {viewModel.selectedImportType === "url" && (
                <>
                    <label>{t("add_database.placeholder.name")}</label>
                    <input
                        type="text"
                        value={viewModel.field1}
                        onChange={(e) => viewModel.setField1(e.target.value)}
                        placeholder={t("add_database.placeholder.name")}
                        autoFocus
                    />
                    <label>Datenbank ID</label>
                    <div className="urlWrapper">
                        <div className={"input-with-qr-container"} style={{position: "relative", width: "100%"}}>
                            <input
                                type="text"
                                value={viewModel.field2}
                                onChange={(e) => viewModel.setField2(e.target.value)}
                                placeholder={t("add_database.placeholder.id")}
                                onKeyDown={handleKeyDown}
                            />
                            <ShareDatabaseQRScannerDialog setInputFields={(name, url) => {
                                viewModel.setField1(name);
                                viewModel.setField2(url);
                            }}/>
                        </div>
                    </div>
                </>
            )}

            {(viewModel.selectedImportType === "file" || viewModel.selectedImportType === "filedecrypt") && (
                <>
                    <label>{t("add_database.placeholder.name")}</label>
                    <input
                        type="text"
                        value={viewModel.field1}
                        onChange={(e) => viewModel.setField1(e.target.value)}
                        placeholder={t("add_database.placeholder.name")}
                        autoFocus
                    />
                    {viewModel.selectedImportType === "filedecrypt" &&
                        <>
                            <label>{t("add_database.placeholder.password")}</label>
                            <div className={"password-container"}>
                                <input
                                    type={hidePassword ? "password" : "text"}
                                    value={viewModel.field2}
                                    onChange={(e) => viewModel.setField2(e.target.value)}
                                    placeholder={t("add_database.placeholder.password")}
                                    onKeyDown={handleKeyDown}
                                />
                                <EyeButton hidePassword={hidePassword} toggleHidePassword={toggleHidePassword}
                                           size={49}/>
                            </div>
                        </>}
                    <label>{t("add_database.create_new.choose_file")}</label>
                    <label htmlFor="file-upload" className="file-upload">
                        {viewModel.targetFiles === null || viewModel.targetFiles.length < 1
                            ? <span>{t("add_database.create_new.choose_file")}</span>
                            : <span className={"visible"}>{viewModel.targetFiles[0].name}</span>
                        }
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept={(viewModel.selectedImportType === "file") ? ".encpwdb" : ".csv"}
                        style={{display: "none"}}
                        onChange={(event) => viewModel.setTargetFiles(event.target.files)}
                    />
                </>
            )}

            {/* Shared Action Buttons */}
            <div className="confirm-cancel-buttons" style={{marginTop: "20px"}}>
                <button className={"rectangle-button"} onClick={viewModel.handleConfirm}>{t("button.confirm")}</button>
                <button className={"rectangle-button"} onClick={onCancel}>{t("button.cancel")}</button>
            </div>
        </Dialog>
    );
};

export default CreateDatabaseDialog;
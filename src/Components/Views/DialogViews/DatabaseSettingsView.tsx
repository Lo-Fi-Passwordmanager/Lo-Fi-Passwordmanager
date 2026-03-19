import React from "react";
import {HiTrash} from "react-icons/hi";

import DeleteConfirmationDialog from "./DeleteConfirmationDialog.tsx";
import {HistoryDialog} from "./HistoryDialog.tsx";
import ShareDatabaseQRDialog from "./ShareDatabaseQRDialog.tsx";
import ToastDialog from "./ToastDialog.tsx";
import {type AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import {removeDatabase} from "../../../Utility/Storage.ts";
import useDatabaseSettingsViewModel from "../../ViewModels/Dialog/DatabaseSettingsViewModel.ts";
import CopyButton from "../ButtonViews/CopyButton.tsx";

/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const DatabaseSettingsView: React.FC<{
    automergeFacade: AutomergeFacade,
    openedDatabaseName?: string,
    closeDatabase: () => void,
}> = ({automergeFacade, openedDatabaseName, closeDatabase}) => {

    const viewModel = useDatabaseSettingsViewModel(automergeFacade);

    return (
        <>
            <ToastDialog message={viewModel.message} isVisible={viewModel.toastVisible}
                         onClose={() => viewModel.setToastVisible(false)}/>
            <div className="dbSettingsContainer">
                <div style={{display: "flex", justifyContent: "space-between", gap: "12px"}}>
                    <CopyButton
                        copyToClipboard={viewModel.copyURLToClipboard}
                        attributeValue={""}
                        title="Datenbank ID in die Zwischenablage kopieren"
                        style={{marginLeft: "0", width: "100%"}}
                        content={"Datenbank ID kopieren"}
                    />
                    <ShareDatabaseQRDialog name={openedDatabaseName!}
                                           url={(automergeFacade.automergeURL as string).replace("automerge:", "")}/>
                </div>
                <button onClick={viewModel.exportDatabase}>
                    Verschlüsselt Exportieren
                </button>

                <HistoryDialog automergeFacade={automergeFacade}/>

                <button
                    className={"delete"}
                    style={{gap: "0.2rem"}}
                    onClick={() => {
                        viewModel.setInDeletion(true);
                    }}><HiTrash size={24}/> Datenbank lokal löschen
                </button>

                {viewModel.inDeletion && (<DeleteConfirmationDialog
                    database={openedDatabaseName}
                    onConfirmDb={(db) => {
                        closeDatabase();
                        removeDatabase(db);
                        viewModel.setInDeletion(false);
                    }}
                    onClose={() => viewModel.setInDeletion(false)}
                />)}

            </div>
        </>
    );
};

export default DatabaseSettingsView;
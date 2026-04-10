import React from "react";
import {HiTrash} from "react-icons/hi";

import DeleteConfirmationDialog from "./DeleteConfirmationDialog.tsx";
import {HistoryDialog} from "./HistoryDialog.tsx";
import ShareDatabaseQRDialog from "./ShareDatabaseQRDialog.tsx";
import {type AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import {removeDatabase} from "../../../Utility/Storage.ts";
import {useAutomergeFacade} from "../../../Utility/useAutomergeFacade.ts";
import useDatabaseSettingsViewModel from "../../ViewModels/Dialog/DatabaseSettingsViewModel.ts";
import CopyButton from "../ButtonViews/CopyButton.tsx";
import {useTranslation} from "react-i18next";

/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const DatabaseSettingsView: React.FC<{
    automergeFacade: AutomergeFacade,
    openedDatabaseName?: string,
    closeDatabase: () => void,
}> = ({automergeFacade, openedDatabaseName, closeDatabase}) => {

    const reactiveFacade = useAutomergeFacade(automergeFacade);
    const viewModel = useDatabaseSettingsViewModel(automergeFacade, reactiveFacade);
    const {t} = useTranslation();

    return (
        <>
            <div className="dbSettingsContainer">
                <div style={{display: "flex", justifyContent: "space-between", gap: "12px"}}>
                    <CopyButton
                        copyToClipboard={viewModel.copyURLToClipboard}
                        attributeValue={""}
                        title={t("common.copy_db_id")}
                        style={{marginLeft: "0", width: "100%"}}
                        content={t("common.copy_db_id")}
                    />
                    <ShareDatabaseQRDialog name={openedDatabaseName!}
                                           url={(automergeFacade.automergeURL as string).replace("automerge:", "")}/>
                </div>
                <button onClick={viewModel.exportDatabase}>
                    {t("settings.export_encrypted")}
                </button>

                <button onClick={viewModel.exportToCsvFile}>
                    {t("settings.export_unencrypted")}
                </button>


                <HistoryDialog automergeFacade={automergeFacade}/>

                <button
                    className={"delete"}
                    style={{gap: "0.2rem"}}
                    onClick={() => {
                        viewModel.setInDeletion(true);
                    }}><HiTrash size={24}/> {t("delete_db")}
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
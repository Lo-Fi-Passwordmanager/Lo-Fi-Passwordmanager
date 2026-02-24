import React, {useState} from "react";
import {HiTrash} from "react-icons/hi";

import DeleteConfirmationDialog from "./DeleteConfirmationDialog.tsx";
import {HistoryDialog} from "./HistoryDialog.tsx";
import ShareQRDialog from "./ShareQRDialog.tsx";
import {type AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import {saveFile} from "../../../Utility/InputOutputUtil.ts";
import {removeDatabase} from "../../../Utility/Storage.ts";

/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const DatabaseSettingsView: React.FC<{
    automergeFacade: AutomergeFacade,
    openedDatabaseName?: string,
    closeDatabase: () => void,
}> = ({automergeFacade, openedDatabaseName, closeDatabase}) => {
    const [inDeletion, setInDeletion] = useState(false);

    return (
        <>
            <div className="dbSettingsContainer">
                {/* TODO Toast */}
                <div style={{display: "flex", justifyContent: "space-between", gap: "12px"}}>
                    <button
                        style={{width: "100%"}}
                        onClick={
                            () => void navigator.clipboard.writeText(
                                (automergeFacade.automergeURL as string).replace("automerge:", "")
                            )
                        }>
                        URL kopieren
                    </button>
                    <ShareQRDialog name={openedDatabaseName!}
                                   url={(automergeFacade.automergeURL as string).replace("automerge:", "")}/>
                </div>
                <button onClick={() => void saveFile(automergeFacade.exportAutomergeToBinary())}>Verschlüsselt Exportieren
                </button>
                <HistoryDialog automergeFacade={automergeFacade}/>
                <button
                    className={"delete"}
                    style={{gap:"0.2rem"}}
                    onClick={() => {
                        setInDeletion(true)
                    }}><HiTrash size={24}/> Datenbank lokal löschen
                </button>
                {/*
                TODO Hier export (Datei)
                <button>Unverschlüsselt Exportieren</button>

                */}
                {inDeletion && (<DeleteConfirmationDialog
                    database={openedDatabaseName}
                    onConfirmDb={(db) => {
                        closeDatabase();
                        removeDatabase(db);
                        setInDeletion(false);
                    }}
                    onClose={() => setInDeletion(false)}
                />)}

            </div>
        </>
    );
};

export default DatabaseSettingsView;
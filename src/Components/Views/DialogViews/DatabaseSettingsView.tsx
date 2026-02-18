import {type AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import React from "react";
import {saveFile} from "../../../Utility/InputOutputUtil.ts";
import {HistoryDialog} from "./HistoryDialog.tsx";
import ShareQRDialog from "./ShareQRDialog.tsx";
import {removeDatabase} from "../../../Utility/Storage.ts";

/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const DatabaseSettingsView: React.FC<{
    automergeFacade: AutomergeFacade,
    openedDatabaseName?: string,
    closeDatabase: () => void,
}> = ({automergeFacade, openedDatabaseName, closeDatabase}) => {

    return (
        <>
            <div className="dbSettingsContainer">
                {/* TODO Toast */}
                <div style={{display: "flex", justifyContent: "space-between", gap: "12px"}}>
                    <button
                        style={{width: "100%"}}
                        onClick={
                            () => navigator.clipboard.writeText(
                                (automergeFacade.automergeURL as string).replace("automerge:", "")
                            )
                        }>
                        URL kopieren
                    </button>
                    <ShareQRDialog name={openedDatabaseName!}
                                   url={(automergeFacade.automergeURL as string).replace("automerge:", "")}/>
                </div>
                <button onClick={() => saveFile(automergeFacade.exportAutomergeToBinary())}>Verschlüsselt Exportieren
                </button>
                <HistoryDialog automergeFacade={automergeFacade}/>
                <button
                    onClick={() => {
                        removeDatabase(openedDatabaseName!);
                        closeDatabase();
                    }}>Datenbank lokal löschen
                </button>
                {/*
                TODO Hier export (Datei)
                <button>Unverschlüsselt Exportieren</button>

                */}
            </div>
        </>
    );
};

export default DatabaseSettingsView;
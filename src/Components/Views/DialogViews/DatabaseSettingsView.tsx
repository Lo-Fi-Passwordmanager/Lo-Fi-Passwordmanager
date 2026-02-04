import  {type AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import React from "react";
import {saveFile} from "../../../Utility/InputOutputUtil.ts";
import {HistoryDialog} from "./HistoryDialog.tsx";
import ShareQRDialog from "./ShareQRDialog.tsx";

/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const DatabaseSettingsView: React.FC<{
    automergeFacade: AutomergeFacade,
    openedDatabaseName?: string
}> = ({automergeFacade, openedDatabaseName}) => {

    return (
        <>
            <div className="dbSettingsContainer">
                {/* TODO Toast */}
                <div>
                <button
                    onClick={
                        () => navigator.clipboard.writeText(
                            (automergeFacade.automergeURL as string).replace("automerge:", "")
                        )
                    }>
                    URL kopieren
                </button>
                <ShareQRDialog name={openedDatabaseName!} url={(automergeFacade.automergeURL as string).replace("automerge:", "")} />
                </div>
                <button onClick={() => saveFile(automergeFacade.exportAutomergeToBinary())}>Verschlüsselt Exportieren
                </button>
                <HistoryDialog automergeFacade={automergeFacade}/>
                {/*
                /* TODO Datenbank löschen und abmelden
                <button>Datenbank lokal löschen</button>

                /* TODO Hier export (Datei)
                <button>Unverschlüsselt Exportieren</button>

                */}
            </div>
        </>
    );
};

export default DatabaseSettingsView;
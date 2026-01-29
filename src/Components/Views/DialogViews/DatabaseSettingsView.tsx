import type {AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import React from "react";
import {saveFile} from "../../../Utility/InputOutputUtil.ts";

/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const DatabaseSettingsView: React.FC<{ automergeFacade: AutomergeFacade }> = ({automergeFacade}) => {
    // Auskommentiert, da es gerade nicht verwendet wird
    // const viewmodel = useDatabaseSettingsViewModel();

    return (
        <>
            <div className="dbSettingsContainer">
                {/* TODO Toast */}
                <button
                    onClick={
                        () => navigator.clipboard.writeText(
                            (automergeFacade.automergeURL as string).replace("automerge:", "")
                        )
                    }>
                    URL kopieren
                </button>
                <button onClick={() => saveFile(automergeFacade.exportAutomergeToBinary())}>Verschlüsselt Exportieren</button>
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
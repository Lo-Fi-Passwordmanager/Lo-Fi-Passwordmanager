import type {AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import React from "react";


/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const DatabaseSettingsView: React.FC<{ automergeFacade: AutomergeFacade }> = (automergeFacade) => {
    // Auskommentiert, da es gerade nicht verwendet wird
    // const viewmodel = useDatabaseSettingsViewModel();

    return (
        <>
            <div className="divider"/>
            <div className="dbSettingsContainer">
                <h1 style={{fontSize: "2em", marginBottom: "20px", marginTop: 0}}>Datenbankeinstellungen</h1>
                <button
                    onClick={
                        () => navigator.clipboard.writeText(
                            (automergeFacade.automergeFacade.automergeURL as string).replace("automerge:", "")
                        )
                    }>
                    URL kopieren
                </button>
                <button>Datenbank lokal löschen</button>
                <button>Unverschlüsselt Exportieren</button>
                <button>Verschlüsselt Exportieren</button>
            </div>
        </>
    );
};

export default DatabaseSettingsView;
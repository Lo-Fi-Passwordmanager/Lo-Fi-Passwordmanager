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
            <h1 style={{fontSize: "2em", marginBottom: "20px"}}>Datenbankeinstellungen</h1>

            {/* Following are the checkboxes and their description */}
            <div className="dbSettingsContainer">
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
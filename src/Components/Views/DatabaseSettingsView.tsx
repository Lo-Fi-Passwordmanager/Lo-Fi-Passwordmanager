import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";
import {useDatabaseSettingsViewModel} from "../ViewModels/DatabaseSettingsViewModel.ts";
import type {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";


/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const DatabaseSettingsView: React.FC<{automergeFacade: AutomergeFacade}> = (automergeFacade) => {
    const viewmodel = useDatabaseSettingsViewModel();

    /**
     * Checks if the settingsmenu should be open or not
     */
    if (viewmodel.settingsOpen) {
        return (
            <div className="settingsBackground dialogOverlay" style={{padding: "0.6rem"}}>
                <div className="dialog">
                    <h1 style={{fontSize: "2em", marginBottom: "20px"}}>Datenbankeinstellungen</h1>

                    {/* Following are the checkboxes and their description */}
                    <div className="settingsContainer">
                        <button onClick={() => navigator.clipboard.writeText((automergeFacade.automergeFacade.automergeURL as string).replace("automerge:", ""))}>URL kopieren</button>
                        <button>Datenbank lokal löschen</button>
                        <button>Exportieren</button>
                        <button>Exportieren</button>
                    </div>
                    <button onClick={() => viewmodel.setSettingsOpen(false)}>Einstellungen Schließen</button>
                </div>
            </div>
        );

        /**
         * If settingsmenu should not be open, only the button to open it, is seen in the top right corner
         */
    } else {
        return (
            <button
                className="settingsButton"
                style={{right: "15%"}}
                onClick={() => viewmodel.setSettingsOpen(true)}>Datenbankeinstellungen Öffnen
            </button>
        )
    }

}

export default DatabaseSettingsView;
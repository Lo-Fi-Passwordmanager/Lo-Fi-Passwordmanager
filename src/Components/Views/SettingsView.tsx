import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";


/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const SettingsView: React.FC = () => {
    const viewmodel = useSettingsViewModel();


    /**
     * Checks if the settingsmenu should be open or not
     */
    if (viewmodel.settingsOpen) {
        return (
            <div className="settingsBackground dialogOverlay">
                <div className="dialog">
                    <h1 style={{fontSize: "2em", marginBottom: "20px"}}>Einstellungen</h1>

                    {/* Following are the checkboxes and their description */}
                    <div className="settingsContainer">
                        <div>
                            <label className="checkboxRow">
                                <input
                                    type="checkbox"
                                    checked={viewmodel.darkMode}
                                    onChange={viewmodel.toggleDarkMode}
                                />
                                Darkmode
                            </label>
                        </div>

                        <div>
                            <label className="checkboxRow">
                                <input
                                    type="checkbox"
                                    checked={viewmodel.synchronisation}
                                    onChange={viewmodel.toggleSynchronisation}
                                />
                                Synchronisation
                            </label>
                        </div>

                        <div>
                            <label className="checkboxRow">
                                <input
                                    type="checkbox"
                                    checked={viewmodel.autoConclictRes}
                                    onChange={viewmodel.toggleAutoConclictRes}
                                />
                                Konfliktauflösung
                            </label>
                        </div>

                        <div>
                            <label className="checkboxRow">
                                <input
                                    type="checkbox"
                                    checked={viewmodel.timeOutActive}
                                    onChange={viewmodel.toggleTimeOutActive}
                                />
                                Sperren der App bei Inaktivität
                            </label>
                        </div>
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
                onClick={() => viewmodel.setSettingsOpen(true)}>Einstellungen Öffnen
            </button>
        )
    }

}

export default SettingsView;
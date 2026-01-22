import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";
import React from "react";


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
                                    checked={viewmodel.autoConflictRes}
                                    onChange={viewmodel.toggleAutoConflictRes}
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
                                Bei Inaktivität abmelden
                            </label>
                        </div>

                        {viewmodel.timeOutActive && <div>
                            <label>Minuten bis Abmeldung: </label>
                            <input
                                className="inputField"
                                type="number"
                                value={viewmodel.timeoutLength}
                                onChange={(e) => viewmodel.setTimeOutLengthVM(e.target.value)}
                                min="1"
                                max="120"
                                step="1"
                            />
                        </div>}
                    </div>
                    <button onClick={() => viewmodel.setSettingsOpen(false)} style={{marginTop: "1em"}}>Einstellungen
                        Schließen
                    </button>
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
                onClick={() => viewmodel.setSettingsOpen(true)}>⚙️
            </button>
        );
    }

};

export default SettingsView;
import {useSettingsViewModel} from "../../ViewModels/SettingsViewModel.ts";
import React from "react";
import type {AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import DatabaseSettingsView from "./DatabaseSettingsView.tsx";


/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const SettingsView: React.FC<{ automergeFacade?: AutomergeFacade | null }> = ({automergeFacade}) => {
    const viewmodel = useSettingsViewModel();


    /**
     * Checks if the settingsmenu should be open or not
     */
    if (viewmodel.settingsOpen) {
        return (
            <>
                <button
                    className="settingsButton"
                    onClick={() => viewmodel.setSettingsOpen(true)}>Einstellungen Öffnen
                </button>
                <div className="settingsBackground dialogOverlay" onClick={() => viewmodel.setSettingsOpen(false)}>
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

                        {automergeFacade && <DatabaseSettingsView automergeFacade={automergeFacade}/>}
                    </div>
                </div>
            </>
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
        );
    }

};

export default SettingsView;
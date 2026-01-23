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

                        {viewmodel.timeOutActive && <div className={"timeout-setting"}>
                            <label>Minuten bis Abmeldung: </label>
                            <div className={"numberInput"}>
                                <input
                                    type="number"
                                    value={viewmodel.timeoutLength}
                                    onChange={(e) => viewmodel.setTimeOutLengthVM(e.target.value)}
                                    min="1"
                                    max="120"
                                    step="1"
                                />
                                <button className={"number-control"} onClick={viewmodel.decrease}>–</button>
                                <button className={"number-control"} onClick={viewmodel.increase}>+</button>
                            </div>
                        </div>}
                    </div>
                    <div>
                        <label>{"Deine Peer Id: \n"}</label>
                    </div>
                    <div>
                        <label>{viewmodel.getPeerId()}</label>
                    </div>

                    <label>Other Peer Id</label>
                    <input type="text" onChange={(e) => viewmodel.setConnection(e.target.value)} />

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
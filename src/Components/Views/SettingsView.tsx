import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";

const SettingsView: React.FC = () => {
    const viewmodel = useSettingsViewModel();


    if (viewmodel.settingsOpen) {
        return (
            <div className="settingsBackground dialogOverlay">
                <div className="dialog">
                    <h1 style={{ fontSize: "2em", marginBottom: "20px" }}>Settings</h1>

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
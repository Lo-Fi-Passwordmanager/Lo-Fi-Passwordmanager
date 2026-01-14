import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";
import {checkboxRowStyle, settingsContainer} from "../../CSS.ts";
import OnClickButton from "./ButtonViews/OnClickButton.tsx";

const SettingsView: React.FC = () => {
    const viewmodel = useSettingsViewModel();


    if (viewmodel.settingsOpen) {
        return (
            <div className="settingsBackground">
                <button onClick={() => viewmodel.setSettingsOpen(false)}>Einstellungen Schließen</button>
                <h1 style={{ fontSize: "2em", marginBottom: "20px" }}>Settings</h1>

                <div style={settingsContainer}>
                    <div>
                        <label style={checkboxRowStyle}>
                            <input
                                type="checkbox"
                                checked={viewmodel.darkMode}
                                onChange={viewmodel.toggleDarkMode}
                            />
                            Darkmode
                        </label>
                    </div>

                    <div>
                        <label style={checkboxRowStyle}>
                            <input
                                type="checkbox"
                                checked={viewmodel.synchronisation}
                                onChange={viewmodel.toggleSynchronisation}
                            />
                            Synchronisation
                        </label>
                    </div>

                    <div>
                        <label style={checkboxRowStyle}>
                            <input
                                type="checkbox"
                                checked={viewmodel.autoConclictRes}
                                onChange={viewmodel.toggleAutoConclictRes}
                            />
                            Konfliktauflösung
                        </label>
                    </div>

                    <div>
                        <label style={checkboxRowStyle}>
                            <input
                                type="checkbox"
                                checked={viewmodel.timeOutActive}
                                onChange={viewmodel.toggleTimeOutActive}
                            />
                            Sperren der App bei Inaktivität
                        </label>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <button onClick={() => viewmodel.setSettingsOpen(true)}>Einstellungen Öffnen</button>
        )
    }

}

export default SettingsView;
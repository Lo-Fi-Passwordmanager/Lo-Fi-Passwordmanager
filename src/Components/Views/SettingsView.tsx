import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";
import {checkboxRowStyle, settingsContainer} from "../../CSS.ts";

const SettingsView: React.FC = () => {
    const viewmodel = useSettingsViewModel();

    return (
        <div>
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
}

export default SettingsView;
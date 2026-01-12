import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";

const SettingsView: React.FC = () => {
    const viewmodel = useSettingsViewModel();


    return (
        <div>
            <h1> Settings </h1>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={viewmodel.darkMode}
                            onChange={viewmodel.toggleDarkMode}
                        />
                    </label>
                    <p>Darkmode</p>
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={viewmodel.synchronisation}
                            onChange={viewmodel.toggleSynchronisation}
                        />
                    </label>
                    <p>Synchronisation</p>
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={viewmodel.autoConclictRes}
                            onChange={viewmodel.toggleAutoConclictRes}
                        />
                    </label>
                    <p>Konfliktauflösung</p>
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={viewmodel.timeOutActive}
                            onChange={viewmodel.toggleTimeOutActive}
                        />
                    </label>
                    <p>Sperren der App bei Inaktivität</p>
                </div>
            </div>
        </div>
);
}

export default SettingsView;
import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";

const SettingsView: React.FC = () => {
    const viewmodel = useSettingsViewModel();


    return (
        <div>
            <h1> Settings </h1>
            <label>
                <input
                    type="checkbox"
                    checked={viewmodel.darkMode}
                    onChange={viewmodel.toggleDarkMode}
                />
                Dark mode
            </label>
        </div>
);
}

export default SettingsView;
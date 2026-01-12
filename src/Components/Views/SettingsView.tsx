import {SettingsViewModel} from "../ViewModels/SettingsViewModel.ts";

const SettingsView: React.FC = () => {
    let viewmodel = new SettingsViewModel();


    return (
        <div>
            <h1> Settings </h1>
            <input type={"checkbox"} checked={viewmodel.darkMode} onClick={viewmodel.toggleDarkMode} onChange={viewmodel.toggleDarkMode}>Darkmode: </input>
        </div>
);
}

export default SettingsView;
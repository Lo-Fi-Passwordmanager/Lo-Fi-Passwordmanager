import React from "react";
import {usePasswordManagerViewModel} from "../ViewModels/PasswordManagerViewModel.ts";
import LoginView from "./LoginView.tsx";
import SettingsView from "./SettingsView.tsx";
import PasswordView from "./PasswordView.tsx";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {RepoContext} from "@automerge/react";

const PasswordManagerView: React.FC = () => {

    const viewModel = usePasswordManagerViewModel();

    return (
        <RepoContext.Provider value={viewModel.repo}>
            <LoginView
                viewModel={viewModel.loginViewModel}
            />
            <SettingsView/>
            <PasswordView/>
        </RepoContext.Provider>
    );
}

export default PasswordManagerView;
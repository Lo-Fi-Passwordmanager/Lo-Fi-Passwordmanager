import React from "react";
import {usePasswordManagerViewModel} from "../ViewModels/PasswordManagerViewModel.ts";
import LoginView from "./LoginView.tsx";
import SettingsView from "./SettingsView.tsx";
import PasswordView from "./PasswordView.tsx";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {RepoContext} from "@automerge/react";

const PasswordManagerView: React.FC = () => {

    const viewModel = usePasswordManagerViewModel();

    if (!viewModel.getLoggedIn()) {
        return (
            <>
                <RepoContext.Provider value={viewModel.repo}>
                <SettingsView/>
                <LoginView repo={viewModel.repo} setLoggedIn={viewModel.setLoggedIn} setAutomergeFacade={viewModel.setAutomergeFacade} />
                </RepoContext.Provider>
                </>
        );
    } else {
        return (
            <>
               <RepoContext.Provider value={viewModel.repo}>
                <SettingsView/>
                <PasswordView automergeFacade={viewModel.getAutomergeFacade()} />
               </RepoContext.Provider>
            </>
        );
    }

}

export default PasswordManagerView;
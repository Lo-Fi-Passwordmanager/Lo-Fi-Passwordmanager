import React, {Suspense} from "react";
import {usePasswordManagerViewModel} from "../ViewModels/PasswordManagerViewModel.ts";
import LoginView from "./LoginView.tsx";
import SettingsView from "./SettingsView.tsx";
import PasswordView from "./PasswordView.tsx";
import {RepoContext} from "@automerge/react";

const PasswordManagerView: React.FC = () => {

    const viewModel = usePasswordManagerViewModel();

    if (!viewModel.getLoggedIn()) {
        return (
            <>
                <RepoContext.Provider value={viewModel.repo}>
                    <SettingsView getSync={viewModel.getSyncSetting}/>
                    <LoginView repo={viewModel.repo} setLoggedIn={viewModel.setLoggedIn}
                               setAutomergeFacade={viewModel.setAutomergeFacade}
                               securityProvider={viewModel.securityProvider}/>
                </RepoContext.Provider>
            </>
        );
    } else {
        return (
            <>
                <Suspense fallback={<p>Loading passwords...</p>}>
                    <RepoContext.Provider value={viewModel.repo}>
                        <button className="closeButton" onClick={viewModel.closeLoggedIn}>Datenbank schließen</button>
                        <SettingsView getSync={viewModel.getSyncSetting}/>
                        <PasswordView automergeFacade={viewModel.getAutomergeFacade()}/>
                    </RepoContext.Provider>
                </Suspense>
            </>
        );
    }

}

export default PasswordManagerView;
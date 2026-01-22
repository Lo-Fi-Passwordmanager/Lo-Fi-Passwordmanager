import React, {Suspense} from "react";
import {usePasswordManagerViewModel} from "../ViewModels/PasswordManagerViewModel.ts";
import LoginView from "./LoginView.tsx";
import SettingsView from "./SettingsView.tsx";
import PasswordView from "./PasswordView.tsx";
import {RepoContext} from "@automerge/react";
import LoadingScreen from "./Dialogs/LoadingScreen.tsx";
import ToastDialog from "./Dialogs/ToastDialog.tsx";

const PasswordManagerView: React.FC = () => {

    const viewModel = usePasswordManagerViewModel();

    // Fügt das Repo als zu global hinzu, sodass man im Browser einfach auf das Repo zugreifen kann, zum debuggen.
    // Nur während 'yarn dev' verfügbar, nach dem build nicht mehr
    if (import.meta.env.DEV) {
        window.repo = viewModel.repo;
    }

    if (!viewModel.getLoggedIn()) {
        return (
            <RepoContext.Provider value={viewModel.repo}>
                <SettingsView setSync={viewModel.setSyncSetting}/>
                <LoginView repo={viewModel.repo} setLoggedIn={viewModel.setLoggedIn}
                           setAutomergeFacade={viewModel.setAutomergeFacade}
                           securityProvider={viewModel.securityProvider}
                setOpenedDbName={viewModel.setOpenedDatabaseName}/>
                <ToastDialog message={viewModel.toastMessage}
                             isVisible={viewModel.toastVisible}
                             onClose={() => viewModel}>
                </ToastDialog>
            </RepoContext.Provider>

        );
    } else {
        return (
            <Suspense fallback={<LoadingScreen/>}>
                <RepoContext.Provider value={viewModel.repo}>
                    <button className="closeButton" onClick={viewModel.closeLoggedIn}>Datenbank schließen</button>
                    <SettingsView setSync={viewModel.setSyncSetting}/>
                    <PasswordView automergeFacade={viewModel.getAutomergeFacade()}
                    openedDbName={viewModel.openedDatabaseName}/>
                </RepoContext.Provider>
            </Suspense>
        );
    }

};

export default PasswordManagerView;
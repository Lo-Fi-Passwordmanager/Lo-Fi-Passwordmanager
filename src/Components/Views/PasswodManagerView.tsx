import React, {Suspense} from "react";
import {usePasswordManagerViewModel} from "../ViewModels/PasswordManagerViewModel.ts";
import LoginView from "./LoginView.tsx";
import SettingsView from "./SettingsView.tsx";
import PasswordView from "./PasswordView.tsx";
import {RepoContext} from "@automerge/react";
import LoadingScreen from "./DialogViews/LoadingScreen.tsx";
import ToastDialog from "./DialogViews/ToastDialog.tsx";
import PWMLogo from "../../assets/logo_gelb.svg?inline";

/**
 * The main view of the password manager application. It handles the login state and displays either the login view or the password view.
 */
const PasswordManagerView: React.FC = () => {

    const viewModel = usePasswordManagerViewModel();

    // Fügt das Repo als zu global hinzu, sodass man im Browser einfach auf das Repo zugreifen kann, zum debuggen.
    // Nur während 'yarn dev' verfügbar, nach dem build nicht mehr
    if (import.meta.env.DEV) {
        window.repo = viewModel.repo;
    }

    if (!viewModel.loggedIn) {
        return (
            <RepoContext.Provider value={viewModel.repo}>
                <SettingsView/>
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
                    <div className={"header"} style={{height: '5vh', display: 'flex', alignItems: 'center', gap: '2rem'}}>
                        <img src={PWMLogo} className="logo header" alt="Passwortmanager Logo"/>
                        <h2>LoFi Passwortmanager</h2>
                        <SettingsView automergeFacade={viewModel.getAutomergeFacade()} openedDbName={viewModel.openedDatabaseName}/>
                    </div>
                    <PasswordView automergeFacade={viewModel.getAutomergeFacade()}
                                  closeDatabase={() => viewModel.closeLoggedIn()}
                                  openedDbName={viewModel.openedDatabaseName}/>
                </RepoContext.Provider>
            </Suspense>
        );
    }

};

export default PasswordManagerView;
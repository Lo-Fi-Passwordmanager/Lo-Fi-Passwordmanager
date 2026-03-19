import {RepoContext} from "@automerge/react";
import React, {Suspense} from "react";
import {RiHistoryLine} from "react-icons/ri";

import LoadingScreen from "./DialogViews/LoadingScreen.tsx";
import ToastDialog from "./DialogViews/ToastDialog.tsx";
import LoginView from "./LoginView.tsx";
import PasswordView from "./PasswordView.tsx";
import SettingsView from "./SettingsView.tsx";
import PWMLogo from "../../assets/logo_gelb.svg?inline";
import {usePasswordManagerViewModel} from "../ViewModels/PasswordManagerViewModel.ts";
import {HistoryDialog} from "./DialogViews/HistoryDialog.tsx";

/**
 * The main view of the password manager application. It handles the login state and displays either the login view or the password view.
 */
const PasswordManagerView: React.FC = () => {

    const viewModel = usePasswordManagerViewModel();


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
                             onClose={() => viewModel}/>
            </RepoContext.Provider>

        );
    } else {
        return (
            <Suspense fallback={<LoadingScreen/>}>
                <RepoContext.Provider value={viewModel.repo}>
                    <div className={"password-manager-header"}>
                        <img src={PWMLogo} style={{cursor: "pointer"}} onClick={() => viewModel.closeLoggedIn()}
                             className="logo header" alt="Passwortmanager Logo"/>
                        <h2 onClick={() => viewModel.closeLoggedIn()} style={{cursor: "pointer"}}>LoFi
                                                                                                  Passwortmanager</h2>
                        <HistoryDialog automergeFacade={viewModel.getAutomergeFacade()!} className={"histroyButton"}>
                            <RiHistoryLine size={24}/>
                        </HistoryDialog>
                        <SettingsView automergeFacade={viewModel.getAutomergeFacade()}
                                      openedDbName={viewModel.openedDatabaseName}
                                      closeDatabase={() => viewModel.closeLoggedIn()}
                        />
                    </div>

                    <PasswordView automergeFacade={viewModel.getAutomergeFacade()}
                                  closeDatabase={() => viewModel.closeLoggedIn()}
                                  openedDbName={viewModel.openedDatabaseName}/>
                    <ToastDialog message={viewModel.toastMessage}
                                 isVisible={viewModel.toastVisible}
                                 onClose={() => viewModel}/>
                </RepoContext.Provider>
            </Suspense>
        );
    }

};

export default PasswordManagerView;
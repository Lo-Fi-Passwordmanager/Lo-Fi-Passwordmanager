import type {Repo} from "@automerge/react";
import React from "react";
import {HiMiniPlus} from "react-icons/hi2";

import {useLoginViewModel} from "../ViewModels/loginViewModel.ts";
import CreateDatabaseDialog from "./DialogViews/CreateDatabaseDialog.tsx";
import DeleteConfirmationDialog from "./DialogViews/DeleteConfirmationDialog.tsx";
import LoginDatabaseDialog from "./DialogViews/LoginDatabaseDialog.tsx";
import ToastDialog from "./DialogViews/ToastDialog.tsx";
import DatabaseListingView from "./ListingViews/DatabaseListingView.tsx";
import PWMLogo from "../../assets/logo_gelb.svg?inline";
import {type AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import  {type SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";

/**
 * The view that should be shown, when the user is not logged in yet and can select/create a database to open plus other related actions
 * @param repo the automerge repo
 * @param setLoggedIn method to set the logged in state
 * @param setAutomergeFacade method to set the automerge facade after opening a database
 * @param securityProvider the security provider used for encryption/decryption
 * @param setOpenedDbName method to set the name of the currently opened database
 */
const LoginView: React.FC<{
    repo: Repo,
    setLoggedIn: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setAutomergeFacade: (value: (((prevState: (AutomergeFacade | null)) => (AutomergeFacade | null)) | AutomergeFacade | null)) => void,
    securityProvider: SecurityProvider,
    setOpenedDbName: (value: (((prevState: string) => string) | string)) => void
}> = ({repo, setLoggedIn, setAutomergeFacade, securityProvider, setOpenedDbName}) => {

    const viewModel = useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, securityProvider, setOpenedDbName);

    return (
        <div className="loginView">

            <img src={PWMLogo} className="logo" alt="Passwortmanager Logo"/>
            <header>Lo-Fi Passwort&shy;manager</header>
            <main className="flexContainer">

                <div className="databaseSelection">
                    {/* Show a list of all available Documents */}
                    <DatabaseListingView
                        databases={viewModel.databases}
                        openDatabase={viewModel.openEnterPasswordDialog}
                        removeDatabase={viewModel.deleteDatabase}
                        renameDatabase={viewModel.changeDatabaseName}
                    />


                    {/* Button for adding new Database */}
                    <button
                        className={"squareButton"}
                        title="Neue Datenbank erstellen"
                        onClick={viewModel.openAddDialog}>
                        <HiMiniPlus size={24}/>
                    </button>
                </div>
                {/* Popup Dialog for adding a new Database */}
                <LoginDatabaseDialog
                    isOpen={viewModel.isEnterPasswordDialogOpen}
                    title="Datenbank öffnen"
                    label1="Masterpasswort"
                    tryOpenDatabase={(password, name?:string) => {void viewModel.tryOpenDatabase(password, name)}}
                    onCancel={viewModel.closeEnterPasswordDialog}
                    setToastMessage={viewModel.setToastMessage}
                    setShowToast={viewModel.setShowToast}
                    hidePassword={viewModel.hidePassword}
                    toggleHidePassword={viewModel.toggleHidePassword}
                />

                {/* Pop Up Dialog for creating a new Database */}
                <CreateDatabaseDialog
                    isOpen={viewModel.isAddDialogOpen}
                    title="Neue Datenbank erstellen"
                    label1="Datenbankname"
                    label2="Masterpasswort"
                    createDatabase={viewModel.createDatabase}
                    onCancel={viewModel.closeAddDialog}
                    importDatabaseFromURL={(name, url) => {void viewModel.importDatabaseFromURL(name, url);}}
                    setToastMessage={viewModel.setToastMessage}
                    setShowToast={viewModel.setShowToast}
                    importDatabaseFromFile={(files, name) => {
                    void viewModel.importDatabaseFromFile(files, name);}}
                    hidePassword={viewModel.hidePassword}
                    toggleHidePassword={viewModel.toggleHidePassword}
                />

                <DeleteConfirmationDialog
                    database={viewModel.databaseToDelete}
                    onConfirmDb={viewModel.confirmDeleteDatabase}
                    onClose={() => viewModel.setDatabaseToDelete(null)}
                />

            </main>
            <ToastDialog message={viewModel.toastMessage}
                         isVisible={viewModel.showToast}
                         onClose={() => viewModel.setShowToast(false)}/>
        </div>
    );
}

export default LoginView;
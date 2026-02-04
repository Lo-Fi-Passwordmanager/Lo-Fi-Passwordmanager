import React from "react";
import {loginViewModel} from "../ViewModels/LoginViewModel.ts";
import DatabaseListingView from "./ListingViews/DatabaseListingView.tsx";
import CreateDatabaseDialog from "./DialogViews/CreateDatabaseDialog.tsx";
import LoginDatabaseDialog from "./DialogViews/LoginDatabaseDialog.tsx";
import PWMLogo from "../../assets/logo_gelb.svg?inline";
import type {Repo} from "@automerge/react";
import {type AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import  {type SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";
import ToastDialog from "./DialogViews/ToastDialog.tsx";
import {HiMiniPlus} from "react-icons/hi2";
import DeleteConfirmationDialog from "./DialogViews/DeleteConfirmationDialog.tsx";

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

    const viewModel = loginViewModel(repo, setLoggedIn, setAutomergeFacade, securityProvider, setOpenedDbName);

    return (
        <div className="loginView">

            <img src={PWMLogo} className="logo" alt="Passwortmanager Logo"/>
            <header>Lo-Fi Passwortmanager</header>
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
                        onClick={viewModel.openAddDialog}>
                        <HiMiniPlus size={24}/>
                    </button>
                </div>
                {/* Popup Dialog for adding a new Database */}
                <LoginDatabaseDialog
                    isOpen={viewModel.isEnterPasswordDialogOpen}
                    title="Datenbank öffnen"
                    label1="Masterpasswort"
                    tryOpenDatabase={viewModel.tryOpenDatabase}
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
                    importDatabaseFromURL={viewModel.importDatabaseFromURL}
                    setToastMessage={viewModel.setToastMessage}
                    setShowToast={viewModel.setShowToast}
                    importDatabaseFromFile={viewModel.importDatabaseFromFile}
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
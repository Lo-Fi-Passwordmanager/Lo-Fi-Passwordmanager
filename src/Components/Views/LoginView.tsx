import React from "react";
import {useLoginViewModel} from "../ViewModels/UseLoginViewModel.ts";
import DatabaseListingView from "./ListingViews/DatabaseListingView.tsx";
import CreateDatabaseDialog from "./DialogViews/CreateDatabaseDialog.tsx";
import LoginDatabaseDialog from "./DialogViews/LoginDatabaseDialog.tsx";
import PWMLogo from "../../assets/logo_gelb.svg?inline";
import type {Repo} from "@automerge/react";
import {type AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import  {type SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";
import ToastDialog from "./DialogViews/ToastDialog.tsx";
import {HiMiniPlus} from "react-icons/hi2";


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
            <header> Passwort Manager</header>
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
                    onConfirm={viewModel.tryOpenDatabase}
                    onCancel={viewModel.closeEnterPasswordDialog}
                    setToastMessage={viewModel.setToastMessage}
                    setShowToast={viewModel.setShowToast}
                />

                {/* Pop Up Dialog for creating a new Database */}
                <CreateDatabaseDialog
                    isOpen={viewModel.isAddDialogOpen}
                    title="Neue Datenbank erstellen"
                    label1="Datenbankname"
                    label2="Masterpasswort"
                    createDatabase={viewModel.createDatabase}
                    onCancel={viewModel.closeAddDialog}
                    storeDatabase={viewModel.importDatabaseFromURL}
                    setToastMessage={viewModel.setToastMessage}
                    setShowToast={viewModel.setShowToast}
                    importDatabase={viewModel.importDatabaseFromFile}
                />
            </main>
            <ToastDialog message={viewModel.toastMessage}
                         isVisible={viewModel.showToast}
                         onClose={() => viewModel.setShowToast(false)}/>
        </div>
    );
}

export default LoginView;
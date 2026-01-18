import React from "react";
import {useLoginViewModel} from "../ViewModels/UseLoginViewModel.ts";
import DatabaseListing from "./ListingViews/DatabaseListing.tsx";
import CreateDatabaseDialog from "./Dialogs/CreateDatabaseDialog.tsx";
import LoginDatabaseDialog from "./Dialogs/LoginDatabaseDialog.tsx";
import PWMLogo from "../../assets/logo_gelb.svg?inline";
import type {Repo} from "@automerge/react";
import  {type AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import type {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";


const LoginView: React.FC<{
    repo: Repo,
    setLoggedIn: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setAutomergeFacade: (value: (((prevState: (AutomergeFacade | null)) => (AutomergeFacade | null)) | AutomergeFacade | null)) => void,
    securityProvider: SecurityProvider
}> = ({repo, setLoggedIn, setAutomergeFacade, securityProvider}) => {

    const viewModel = useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, securityProvider);

    return (
        <div className="loginView">

            <img src={PWMLogo} className="logo" alt="Passwortmanager Logo"/>
            <header> Passwort Manager</header>
            <main
                className="flexContainer"
            >
                {/* Show a list of all available Documents */}
                <DatabaseListing
                    databases={viewModel.databaseNames}
                    openDatabase={viewModel.openEnterPasswordDialog}
                />


                {/* Button for adding new Database */}
                <button
                    onClick={viewModel.openAddDialog}
                >
                    +
                </button>

                {/* Popup Dialog for adding a new Database */}
                <LoginDatabaseDialog
                    isOpen={viewModel.isEnterPasswordDialogOpen}
                    title="Datenbank öffnen"
                    label1="Masterpasswort"
                    onConfirm={viewModel.tryOpenDatabase}
                    onCancel={viewModel.closeEnterPasswordDialog}
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
                />
            </main>
        </div>
    );
}

export default LoginView;
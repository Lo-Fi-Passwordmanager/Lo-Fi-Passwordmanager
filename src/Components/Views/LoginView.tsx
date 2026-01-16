import React from "react";
import {type LoginViewModelReturn, useLoginViewModel} from "../ViewModels/UseLoginViewModel.ts";
import DatabaseListing from "./ListingViews/DatabaseListing.tsx";
import CreateDatabaseDialog from "./Dialogs/CreateDatabaseDialog.tsx";
import LoginDatabaseDialog from "./Dialogs/LoginDatabaseDialog.tsx";
import PWMLogo from "../../assets/logo_gelb.svg?inline";
import type {Repo} from "@automerge/react";


const LoginView: React.FC<{repo: Repo}> = ({repo}) => {

    const viewmodel = useLoginViewModel(repo);

    if (viewModel.openedDatabase) {
        return (
            <a>Hier provisorischer Text? Wann wird das hier überhaupt gecalled?</a>
        );
    }

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
                    onClick={viewModel.openOpenDialog}
                />


                {/* Button for adding new Database */}
                <button
                    onClick={viewModel.openAddDialog}
                >
                    +
                </button>

                {/* Popup Dialog for adding a new Database */}
                <LoginDatabaseDialog
                    isOpen={viewModel.isOpenDialogOpen}
                    title="Datenbank öffnen"
                    label1="Masterpasswort"
                    onConfirm={viewModel.tryOpenDatabase}
                    onCancel={viewModel.closeOpenDialog}
                />

                {/* Pop Up Dialog for creating a new Database */}
                <CreateDatabaseDialog
                    isOpen={viewModel.isAddDialogOpen}
                    title="Neue Datenbank erstellen"
                    label1="Datenbankname"
                    label2="Masterpasswort"
                    onConfirm={viewModel.createDatabase}
                    onCancel={viewModel.closeAddDialog}
                />
            </main>
        </div>
    );
}

export default LoginView;
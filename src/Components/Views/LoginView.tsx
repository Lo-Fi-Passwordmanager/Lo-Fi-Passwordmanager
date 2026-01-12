import React from "react";
import {useLoginViewModel} from "../ViewModels/UseLoginViewModel.ts";
import EntryView from "./EntryView.tsx";
import OnClickButton from "./ButtonViews/OnClickButton.tsx";
import DatabaseListing from "./ListingViews/DatabaseListing.tsx";
import CreateDatabaseDialog from "./Dialogs/CreateDatabaseDialog.tsx";
import LoginDatabaseDialog from "./Dialogs/LoginDatabaseDialog.tsx";
import {loginViewStyle, headerStyle} from "./CSS.ts";

const LoginView: React.FC = () => {
    const viewModel = useLoginViewModel();

    if (viewModel.openedDatabase) {
        return (
            <EntryView/>
        );
    }

    return (
        <div className="login-view">
            <header> Passwort Manager</header>
            <main
                className="flexContainer"
            >
                {/* Show a list of all available Documents */}
                <DatabaseListing
                    databases={viewModel.databases}
                    onClick={viewModel.openOpenDialog}
                />


                {/* Button for adding new Database */}
                <OnClickButton
                    onClick={viewModel.openAddDialog}
                >
                    +
                </OnClickButton>

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
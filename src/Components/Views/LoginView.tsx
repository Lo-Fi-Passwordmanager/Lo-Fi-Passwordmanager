import React from "react";
import { LoginViewModel } from "../ViewModels/LoginViewModel.ts";
import EntryView from "./EntryView.ts";
import Database from "../../Model/Database.ts";
import OnClickButton from "./ButtonViews/OnClickButton.tsx";
import DatabaseListing from "./ListingViews/DatabaseListing.tsx";
import TwoFieldDialog from "./Dialogs/TwoFieldDialog.tsx";
import OneFieldDialog from "./Dialogs/OneFieldDialog.tsx";

const LoginView: React.FC = () => {
    const viewModel = LoginViewModel();

    if (viewModel.openedDatabase) {
        return (
            <EntryView
                database={viewModel.openedDatabase}
                onClose={() => viewModel.closeDatabase()}
            />
        );
    }

    return (
        <div>
            <h1> Passwort Manager </h1>

            <DatabaseListing
                databases={viewModel.databases}
                onClick={viewModel.openOpenDialog}
            />
            <OnClickButton
                onClick={viewModel.openAddDialog}
            >
                +
            </OnClickButton>

            <OneFieldDialog
                isOpen={viewModel.isOpenDialogOpen}
                title="Datenbank öffnen"
                label1="Masterpasswort"
                onConfirm={viewModel.tryOpenDatabase}
                onCancel={viewModel.closeOpenDialog}
            />

            <TwoFieldDialog
                isOpen={viewModel.isAddDialogOpen}
                title="Neue Datenbank erstellen"
                label1="Datenbankname"
                label2="Masterpasswort"
                onConfirm={viewModel.createDatabase}
                onCancel={viewModel.closeAddDialog}
            />
        </div>
    );
}

export default LoginView;
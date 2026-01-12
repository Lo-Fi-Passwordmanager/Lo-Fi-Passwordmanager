import React from "react";
import {LoginViewModel} from "../ViewModels/LoginViewModel.ts";
import EntryView from "./EntryView.tsx";
import OnClickButton from "./ButtonViews/OnClickButton.tsx";
import DatabaseListing from "./ListingViews/DatabaseListing.tsx";
import TwoFieldDialog from "./Dialogs/TwoFieldDialog.tsx";
import OneFieldDialog from "./Dialogs/OneFieldDialog.tsx";
import {loginViewStyle, headerStyle} from "./CSS.ts";

const LoginView: React.FC = () => {
    const viewModel = LoginViewModel();

    if (viewModel.openedDatabase) {
        return (
            <EntryView/>
        );
    }

    return (
        <div style={loginViewStyle}>
            <header style={headerStyle}> Passwort Manager</header>

            <main>
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
            </main>
        </div>
    );
}

export default LoginView;
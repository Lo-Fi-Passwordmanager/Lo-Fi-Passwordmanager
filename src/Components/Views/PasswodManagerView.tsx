import React from "react";
import {usePasswordManagerViewModel} from "../ViewModels/PasswordManagerViewModel.ts";
import LoginView from "./LoginView.tsx";
import SettingsView from "./SettingsView.tsx";

const PasswordManagerView: React.FC = () => {

    const viewModel = usePasswordManagerViewModel();

    return (
        <>
            <LoginView
                viewModel={viewModel.loginViewModel}
            />
            <SettingsView/>
        </>
    );
}

export default PasswordManagerView;
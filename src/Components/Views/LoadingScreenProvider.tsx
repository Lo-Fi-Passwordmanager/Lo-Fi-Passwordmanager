import LoadingScreen from "./DialogViews/LoadingScreen.tsx";
import {LoadingContext, useLoadingScreenProviderViewModel} from "../ViewModels/LoadingScreenProviderViewModel.ts";
import React from "react";

/**
 * The provider for the loading screen context. It provides the ability to show and hide the loading screen.
 * @param children the children components
 */
export const LoadingScreenProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const viewModel = useLoadingScreenProviderViewModel();

    return (
        <LoadingContext.Provider value={viewModel.setLoadingScreen}>
            {viewModel.loading && <LoadingScreen/>}
            {children}
        </LoadingContext.Provider>
    );
};
import {type Context, createContext, useContext, useState} from "react";

type LoadingScreenContext = (active: boolean) => void

export const LoadingContext: Context<LoadingScreenContext> = createContext((_active) => {});

export function useLoadingScreen() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within LoadingProvider");
    }
    return context;
}

export const useLoadingScreenProviderViewModel = () => {
    const [loading, setLoadingScreen] = useState(false);

    return {
        loading,
        setLoadingScreen
    };
};
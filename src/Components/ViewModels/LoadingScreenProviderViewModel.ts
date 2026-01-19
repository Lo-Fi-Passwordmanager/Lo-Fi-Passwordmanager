import {type Context, createContext, useContext, useState} from "react";

type LoadingScreenContext = (active: boolean) => void

// @ts-expect-error variable is necessary for type compatibility
export const LoadingContext: Context<LoadingScreenContext> = createContext((active) => {});

export function useLoadingScreen() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within LoadingProvider");
    }
    return context;
}

export const useLoadingScreenProviderViewModel = () => {
    const [loading, setLoading] = useState(false);

    function setLoadingScreen(active: boolean) {
        setLoading(active);
    }

    return {
        loading,
        setLoadingScreen
    };
};
// LoadingContext.js
import React, {type Context, createContext, useContext, useState} from "react";

type LoadingScreenContext = (visible: boolean) => void

const LoadingContext: Context<LoadingScreenContext> = createContext((visible) => {
});

export const LoadingScreenProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [loading, setLoading] = useState(false);

    function setLoadingScreen(visible: boolean) {
        setLoading(visible)
    }

    return (
        <LoadingContext.Provider value={setLoadingScreen}>

            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within LoadingProvider");
    }
    return context;
}
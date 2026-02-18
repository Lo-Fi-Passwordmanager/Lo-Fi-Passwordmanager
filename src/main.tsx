import type {Repo} from "@automerge/react";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import {LoadingScreenProvider} from "./Components/Views/LoadingScreenProvider.tsx";
import PasswordManagerView from "./Components/Views/PasswodManagerView.tsx";
import "./styles.css";


// Fügt das Repo als zu global hinzu, sodass man im Browser einfach auf das Repo zugreifen kann, zum debuggen.
// Nur während 'yarn dev' verfügbar, nach dem build nicht mehr
declare global {
    interface Window {
        repo: Repo;
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LoadingScreenProvider>
            <PasswordManagerView/>
        </LoadingScreenProvider>
    </StrictMode>
);

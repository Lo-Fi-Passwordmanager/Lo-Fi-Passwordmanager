import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import PasswordManagerView from "./Components/Views/PasswodManagerView.tsx";
import "./styles.css";
import {LoadingScreenProvider} from "./Components/Views/LoadingScreenProvider.tsx";
import {DocHandle, Repo} from "@automerge/react";
import type {AutomergeDoc} from "./Model/Automerge/AutomergeDoc.ts";
import type {Patch} from "@automerge/automerge";


// Fügt das Repo als zu global hinzu, sodass man im Browser einfach auf das Repo zugreifen kann, zum debuggen.
// Nur während 'yarn dev' verfügbar, nach dem build nicht mehr
declare global {
    interface Window {
        repo: Repo;
        handle: DocHandle<AutomergeDoc>;
        history2: Promise<Patch[][] | null>;
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LoadingScreenProvider>
            <PasswordManagerView/>
        </LoadingScreenProvider>
    </StrictMode>
);

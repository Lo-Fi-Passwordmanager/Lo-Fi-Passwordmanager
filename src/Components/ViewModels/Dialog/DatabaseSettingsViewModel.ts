import {useState} from "react";
import type {AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import {saveFile} from "../../../Utility/InputOutputUtil.ts";

const useDatabaseSettingsViewModel = (automergeFacade: AutomergeFacade) => {
    const [inDeletion, setInDeletion] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [toastVisible, setToastVisible] = useState<boolean>(false);
    const setToast = (toastMessage: string): void => {
        setMessage(toastMessage);
        setToastVisible(true);
    };

    const copyURLToClipboard = (): void => {
        void navigator.clipboard.writeText(
            (automergeFacade.automergeURL as string).replace("automerge:", ""));
        setToast("In die Zwischenablage kopiert")
    }

    function exportDatabase(): void {
        void saveFile(automergeFacade.exportAutomergeToBinary());
        setToast("Erfolgreich exportiert")
    }

    return {
        inDeletion,
        setInDeletion,
        message,
        setMessage,
        toastVisible,
        setToastVisible,
        setToast,
        copyURLToClipboard,
        exportDatabase,
    }
};
export default useDatabaseSettingsViewModel;
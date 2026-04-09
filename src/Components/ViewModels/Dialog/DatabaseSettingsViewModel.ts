import {useState} from "react";

import type {AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import {saveFile, saveToCsv} from "../../../Utility/InputOutputUtil.ts";
import type {AutomergeFacadeHook} from "../../../Utility/useAutomergeFacade.ts";
import {useToast} from "../Provider/ToastProviderViewModel.ts";

const useDatabaseSettingsViewModel = (automergeFacade: AutomergeFacade, reactiveFacade: AutomergeFacadeHook) => {
    const [inDeletion, setInDeletion] = useState(false);
    const [showToast, _] = useToast()

    const copyURLToClipboard = (): void => {
        void navigator.clipboard.writeText(
            (automergeFacade.automergeURL as string).replace("automerge:", ""));
        showToast("In die Zwischenablage kopiert")
    }

    function exportDatabase(): void {
        void saveFile(automergeFacade.exportAutomergeToBinary());
        showToast("Erfolgreich exportiert")
    }

    function exportToCsvFile() {
        const lines = reactiveFacade.exportToCsvArray();
        saveToCsv(lines);
    }

    return {
        exportToCsvFile,
        inDeletion,
        setInDeletion,
        copyURLToClipboard,
        exportDatabase,
    }
};
export default useDatabaseSettingsViewModel;
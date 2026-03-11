import React, {useState} from "react";
import {HiTrash} from "react-icons/hi";

import DeleteConfirmationDialog from "./DeleteConfirmationDialog.tsx";
import {HistoryDialog} from "./HistoryDialog.tsx";
import ShareQRDialog from "./ShareQRDialog.tsx";
import ToastDialog from "./ToastDialog.tsx";
import {type AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import {saveFile} from "../../../Utility/InputOutputUtil.ts";
import {removeDatabase} from "../../../Utility/Storage.ts";

/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const DatabaseSettingsView: React.FC<{
    automergeFacade: AutomergeFacade,
    openedDatabaseName?: string,
    closeDatabase: () => void,
}> = ({automergeFacade, openedDatabaseName, closeDatabase}) => {
    const [inDeletion, setInDeletion] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [toastVisible, setToastVisible] = useState<boolean>(false);
    const setToast = (toastMessage: string): void => {
        setMessage(toastMessage);
        setToastVisible(true);
    };

    return (
        <>
            <ToastDialog message={message} isVisible={toastVisible} onClose={() => setToastVisible(false)}/>
            <div className="dbSettingsContainer">
                {/* TODO Toast */}
                <div style={{display: "flex", justifyContent: "space-between", gap: "12px"}}>
                    <button
                        style={{width: "100%"}}
                        onClick={
                            () => {
                                void navigator.clipboard.writeText(
                                    (automergeFacade.automergeURL as string).replace("automerge:", ""));
                                setToast("Datenbank ID in die Zwischenablage kopiert")
                            }
                        }>
                        Datenbank ID kopieren
                    </button>
                    <ShareQRDialog name={openedDatabaseName!}
                                   url={(automergeFacade.automergeURL as string).replace("automerge:", "")}/>
                </div>
                <button onClick={() => {
                    void saveFile(automergeFacade.exportAutomergeToBinary());
                    setToast("Erfolgreich exportiert")
                }}>Verschlüsselt Exportieren
                </button>

                <HistoryDialog automergeFacade={automergeFacade}/>
                <button
                    className={"delete"}
                    style={{gap: "0.2rem"}}
                    onClick={() => {
                        setInDeletion(true)
                    }}>Datenbank lokal löschen   <HiTrash size={24}/>
                </button>
                {/*
                TODO Hier export (Datei)
                <button>Unverschlüsselt Exportieren</button>

                */}
                {inDeletion && (<DeleteConfirmationDialog
                    database={openedDatabaseName}
                    onConfirmDb={(db) => {
                        closeDatabase();
                        removeDatabase(db);
                        setInDeletion(false);
                    }}
                    onClose={() => setInDeletion(false)}
                />)}

            </div>
        </>
    );
};

export default DatabaseSettingsView;
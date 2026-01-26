import React from "react";
import {useHistoryViewModel} from "../../ViewModels/Dialog/HistoryViewModel.ts";
import Dialog from "./Dialog.tsx";
import {HistoryItem} from "./HistoryItem.tsx";

export const HistoryDialog: React.FC = () => {

    const viewmodel = useHistoryViewModel();

    return (
        <>
            <button
                className="settingsButton"
                onClick={() => viewmodel.setHistoryOpen(true)}
                style={{right: "100px"}}
            >
                hist
            </button>
            {
                viewmodel.historyOpen &&
                <Dialog title="History" onCloseDialog={() => viewmodel.setHistoryOpen(false)}>
                    {/*TODO HistoryItem*/}

                    <HistoryItem/>
                </Dialog>
            }()
        </>
    );
};
import React from "react";
import {useHistoryViewModel} from "../../ViewModels/Dialog/HistoryViewModel.ts";
import Dialog from "./Dialog.tsx";

export const HistoryItem: React.FC = () => {

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
            }
        </>
    );
};
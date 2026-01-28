import React from "react";
import {useHistoryViewModel} from "../../ViewModels/Dialog/HistoryViewModel.ts";
import Dialog from "./Dialog.tsx";
import {HistoryItem} from "./HistoryItem.tsx";
import type {AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import type {HistoryEntry} from "../../../Model/Automerge/HistoryEntry.ts";

export const HistoryDialog: React.FC<{ automergeFacade: AutomergeFacade }> = ({automergeFacade}) => {

    const viewmodel = useHistoryViewModel(automergeFacade);

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
                <Dialog title="History" onCloseDialog={() => viewmodel.setHistoryOpen(false)} className="historyDialog">
                    <div className="divider"/>

                    <div className="scrollableContainer">
                        {viewmodel.automergeHistory &&
                            [...viewmodel.automergeHistory].reverse().map((historyEntry: HistoryEntry, index: number) => {
                                return <HistoryItem key={index} historyEntry={historyEntry}
                                                    securityProvider={automergeFacade.getSecurityProvider()!}/>;
                            })}
                    </div>


                </Dialog>
            }
        </>
    );
};
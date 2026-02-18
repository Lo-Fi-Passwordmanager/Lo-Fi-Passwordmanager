import React from "react";

import Dialog from "./Dialog.tsx";
import {HistoryItem} from "./HistoryItem.tsx";
import type {HistoryEntry} from "../../../Model/Automerge/HistoryEntry.ts";
import type {AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import {useHistoryViewModel} from "../../ViewModels/Dialog/HistoryViewModel.ts";

/**
 * A dialog that shows the history of changes made to the document.
 *
 * @param automergeFacade The automerge facade used to access the document history.
 */
export const HistoryDialog: React.FC<{ automergeFacade: AutomergeFacade }> = ({automergeFacade}) => {

    const viewModel = useHistoryViewModel(automergeFacade);

    return (
        <>
            <button
                onClick={() => {viewModel.setHistoryOpen(true);
                    void viewModel.loadHistory();}}
            >
                Änderungsverlauf
            </button>
            {
                viewModel.historyOpen &&
                <Dialog title="Änderungsverlauf" onCloseDialog={() => viewModel.setHistoryOpen(false)}
                        className="historyDialog">
                    <div className="divider"/>

                    <div className="scrollableContainer">
                        {viewModel.automergeHistory &&
                            [...viewModel.automergeHistory].reverse().map((historyEntry: HistoryEntry, index: number) => {
                                return <HistoryItem key={index} historyEntry={historyEntry}
                                                    securityProvider={automergeFacade.getSecurityProvider()!}/>;
                            })}
                    </div>


                </Dialog>
            }
        </>
    );
};
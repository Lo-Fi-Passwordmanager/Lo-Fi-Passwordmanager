import React, {type HTMLAttributes, type PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";

import Dialog from "./Dialog.tsx";
import {HistoryItem} from "./HistoryItem.tsx";
import type {HistoryEntry} from "../../../Model/Automerge/HistoryEntry.ts";
import type {AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import {useHistoryViewModel} from "../../ViewModels/Dialog/HistoryViewModel.ts";

/**
 * A dialog that shows the history of changes made to the document.
 *
 * @param automergeFacade The automerge facade used to access the document history.
 * @param children Optionally pass children that will be the contents of the button to open this dialog.
 */
export const HistoryDialog: React.FC<{
    automergeFacade: AutomergeFacade
} & PropsWithChildren & HTMLAttributes<HTMLButtonElement>> = ({
                                                                  automergeFacade,
                                                                  children,
                                                                  ...buttonProps
                                                              }) => {

    const viewModel = useHistoryViewModel(automergeFacade);
    const {t} = useTranslation();

    return (
        <>
            <button title={t("history.desc.open")}
                onClick={() => {
                    viewModel.setHistoryOpen(true);
                    void viewModel.loadHistory();
                }}
                {...buttonProps}
            >
                {children ?? t("history.title")}
            </button>
            {
                viewModel.historyOpen &&
                <Dialog title={t("history.title")} onCloseDialog={() => viewModel.setHistoryOpen(false)}
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
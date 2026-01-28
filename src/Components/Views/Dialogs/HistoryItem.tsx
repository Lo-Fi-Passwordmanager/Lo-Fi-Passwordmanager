import React from "react";
import type {HistoryEntry} from "../../../Model/Automerge/HistoryEntry.ts";
import {useHistoryItemViewModel} from "../../ViewModels/Dialog/HistoryItemViewModel.ts";
import type {SecurityProvider} from "../../../Utility/Security/SecurityProvider.ts";

export const HistoryItem: React.FC<{
    historyEntry: HistoryEntry | undefined,
    securityProvider: SecurityProvider
}> = ({historyEntry, securityProvider}) => {
    if (historyEntry === undefined) {
        return;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const viewmodel = useHistoryItemViewModel(historyEntry, securityProvider);

    switch (viewmodel.itemType) {
        case "new":
            if (viewmodel.itemIsFolder) {
                return (
                    <div className="historyEntry">
                        <span className="title">Neuer Ordner</span>
                        <span className="createdDate">{viewmodel.createdAt.toDateString()}</span>
                        <div className="content">
                            <p>Titel:</p><p>{viewmodel.name}</p>
                        </div>
                    </div>
                );
            }
            return (
                <div className="historyEntry">
                    <span className="title">Neuer Eintrag</span>
                    <span className="createdDate">{viewmodel.createdAt.toDateString()}</span>
                    <div className="content">
                        <p>Title:</p><p>{viewmodel.name}</p>
                        <p>Benutzername:</p><p>{viewmodel.username}</p>
                        <p>Passwort:</p><p>{viewmodel.password}</p>
                        <p>Url:</p><p>{viewmodel.url}</p>
                        <p>Notiz:</p><p>{viewmodel.note}</p>
                    </div>
                </div>
            );
        case "deleted":
            if (viewmodel.itemIsFolder) {
                return (
                    <div className="historyEntry deleted">
                        <span className="title">Ordner gelöscht</span>
                        <div className="content">
                            <p>Titel:</p><p>{viewmodel.name}</p>
                            <p>Letzte Änderung:</p><p>{viewmodel.createdAt.toDateString()}</p>
                        </div>
                    </div>
                );
            }
            return (
                <div className="historyEntry deleted">
                    <span className="title">Eintrag gelöscht</span>
                    <div className="content">
                        <p>Title:</p><p>{viewmodel.name}</p>
                        <p>Benutzername:</p><p>{viewmodel.username}</p>
                        <p>Passwort:</p><p>{viewmodel.password}</p>
                        <p>Url:</p><p>{viewmodel.url}</p>
                        <p>Notiz:</p><p>{viewmodel.note}</p>
                        <p>Letzte Änderung:</p><p>{viewmodel.createdAt.toDateString()}</p>
                    </div>
                </div>
            );
        case "update":
            return (
                <div className="historyEntry">
                    <span className="title">{viewmodel.itemIsFolder ? "Ordner bearbeitet" : "Eintrag bearbeitet"}</span>
                    <span className="createdDate">{viewmodel.editedAt.toDateString()}</span>
                    <div className="content">
                        {viewmodel.changes.entries() && Array.from(viewmodel.changes.entries()).map(([attribute, newValue], index) => {
                            if (!(attribute === "editedAt" || attribute === "createdAt")) {
                                return <>
                                    <p key={index}>{viewmodel.getAttributeName(attribute)}</p>
                                    <p key={-index}>{viewmodel.get(attribute)} &rarr; {(typeof newValue === "string") ? viewmodel.decrypt(newValue) : viewmodel.convertDate(newValue)}</p>
                                </>;
                            }
                        })}
                    </div>
                </div>
            );
    }
};
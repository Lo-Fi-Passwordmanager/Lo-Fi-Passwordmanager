import React from "react";
import type {HistoryEntry} from "../../../Model/Automerge/HistoryEntry.ts";
import {useHistoryItemViewModel} from "../../ViewModels/Dialog/HistoryItemViewModel.ts";
import type {SecurityProvider} from "../../../Utility/Security/SecurityProvider.ts";

export const HistoryItem: React.FC<{
    historyEntry: HistoryEntry,
    securityProvider: SecurityProvider
}> = ({historyEntry, securityProvider}) => {

    const viewmodel = useHistoryItemViewModel(historyEntry, securityProvider);

    if (!historyEntry) return null;
    // Map types to visual config
    const config = {
        new: {icon: "✦", class: "status-new", label: viewmodel.itemIsFolder ? "Ordner erstellt" : "Eintrag erstellt"},
        deleted: {
            icon: "✕",
            class: "status-deleted",
            label: viewmodel.itemIsFolder ? "Ordner gelöscht" : "Eintrag gelöscht"
        },
        update: {
            icon: "✎",
            class: "status-update",
            label: viewmodel.itemIsFolder ? "Ordner bearbeitet" : "Eintrag bearbeitet"
        }
    };

    const current = config[viewmodel.itemType as keyof typeof config];

    return (
        <div className={`timeline-item ${current.class}`}>
            <div className="timeline-marker">
                <span className="marker-icon">{current.icon}</span>
                <div className="marker-line"></div>
            </div>

            <div className="timeline-content">
                <div className="timeline-header">
                    <span className="timeline-label">{current.label}</span>
                    <span className="timeline-date">
                        {viewmodel.itemType === "update"
                            ? viewmodel.editedAt.toLocaleDateString()
                            : (viewmodel.itemType === "deleted") ? `Letzte Änderung: ${viewmodel.editedAt.toLocaleDateString()}` : viewmodel.createdAt.toLocaleDateString()}
                    </span>
                </div>

                <div className="timeline-body">
                    <h4 className="item-name">{viewmodel.name || "Unbenannt"}</h4>

                    {viewmodel.itemType === "update" ? (
                        <div className="change-list">
                            {Array.from(viewmodel.changes.entries()).map(([attribute, newValue], index) => {
                                if (attribute === "editedAt" || attribute === "createdAt") return null;
                                return (
                                    <div key={index} className="change-row">
                                        <span className="attr-name">{viewmodel.getAttributeName(attribute)}</span>
                                        <span className="change-path">
                                            <span className="old-val">{viewmodel.get(attribute)}</span>
                                            <span className="arrow">→</span>
                                            <span className="new-val">
                                                {(typeof newValue === "string") ? viewmodel.decrypt(newValue) : viewmodel.convertDate(newValue)}
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="change-list">
                            {viewmodel.username && <div className="change-row">
                                <span className="attr-name">Benutzername</span>
                                <span className="change-path">
                                    <span className="new-val">
                                        {viewmodel.username}
                                    </span>
                                </span>
                            </div>}
                            {viewmodel.password && <div className="change-row">
                                <span className="attr-name">Passwort</span>
                                <span className="change-path">
                                    <span className="new-val">
                                        {viewmodel.password}
                                    </span>
                                </span>
                            </div>}
                            {viewmodel.url && <div className="change-row">
                                <span className="attr-name">URL</span>
                                <span className="change-path">
                                    <span className="new-val">
                                        {viewmodel.url}
                                    </span>
                                </span>
                            </div>}
                            {viewmodel.note && <div className="change-row">
                                <span className="attr-name">Notiz</span>
                                <span className="change-path">
                                    <span className="new-val">
                                        {viewmodel.note}
                                    </span>
                                </span>
                            </div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
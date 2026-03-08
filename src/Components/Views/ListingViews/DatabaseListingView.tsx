import type {AutomergeUrl} from "@automerge/automerge-repo";
import React from "react";
import {HiTrash} from "react-icons/hi";
import {HiMiniLink} from "react-icons/hi2";

import DatabaseListingViewModel from "../../ViewModels/Listing/DatabaseListingViewModel.ts";
import RenameDatabaseDialog from "../DialogViews/RenameDatabaseDialog.tsx";
import ShareQRDialog from "../DialogViews/ShareQRDialog.tsx";
import ToastDialog from "../DialogViews/ToastDialog.tsx";

/**
 * View showing a listing of available databases with options to open, share, rename or delete them.
 * @param databases a map of database names to their Automerge URLs
 * @param openDatabase method to open a database by its name
 * @param removeDatabase method to remove a database by its name
 * @param renameDatabase method to rename a database from old name to new name
 */
const DatabaseListingView: React.FC<{
    databases: Map<string, AutomergeUrl>,
    openDatabase: (db: string) => void;
    removeDatabase: (db: string) => void;
    renameDatabase: (oldName: string, newName: string) => void;
}> = ({
    databases,
    openDatabase,
    removeDatabase,
    renameDatabase
}) => {

    const viewModel = DatabaseListingViewModel();

    if (databases.size === 0) {
        return <div>Keine Datenbanken vorhanden</div>;
    } else {
        return (
            <div className="DatabaseListing">
                {/* List all available Databases which can be opened, shared or deleted */}
                {Array.from(databases).map(([dbName, url]) => (
                    <div className={"DatabaseAndOptions"} key={dbName}>
                        <button
                            onClick={() => openDatabase(dbName)}
                        title="Datenbank öffnen">
                            {dbName}
                        </button>
                        <button
                            className={"squareButton"}
                            onClick={() => void viewModel.copyToClipboard(url)}
                            title="Dokument ID kopieren">
                            <HiMiniLink size={24}/>
                        </button>
                        <ShareQRDialog name={dbName} url={url}/>
                        <RenameDatabaseDialog oldName={dbName} renameDatabase={renameDatabase}/>
                        <button
                            className={"squareButton"}
                            onClick={() => removeDatabase(dbName)}>
                            <HiTrash size={24}
                            title="Datenbank entfernen"/>
                        </button>
                    </div>
                ))}
                <ToastDialog
                    message="Dokument ID in die Zwischenablage kopiert!"
                    isVisible={viewModel.showToast}
                    onClose={() => viewModel.setShowToast(false)}
                />
            </div>
        );
    }
};
export default DatabaseListingView;
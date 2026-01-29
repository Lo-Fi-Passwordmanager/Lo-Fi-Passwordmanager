import type {AutomergeUrl} from "@automerge/automerge-repo";
import React from "react";
import ToastDialog from "../DialogViews/ToastDialog.tsx";
import DatabaseListingViewModel from "../../ViewModels/Listing/DatabaseListingViewModel.ts";
import RenameDatabaseDialog from "../DialogViews/RenameDatabaseDialog.tsx";
import ShareIcon from "../Icons/ShareIcon.tsx";
import BinIcon from "../Icons/BinIcon.tsx";

type DatabaseListingProps = {
    databases: Map<string, AutomergeUrl>,
    openDatabase: (db: string) => void;
    removeDatabase: (db: string) => void;
    renameDatabase: (oldName: string, newName: string) => void;
}

const DatabaseListingView: React.FC<DatabaseListingProps> = ({databases, openDatabase, removeDatabase, renameDatabase}) => {

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
                            onClick={() => openDatabase(dbName)}>
                            {dbName}
                        </button>
                        <button
                            className={"DBListingButton"}
                            style={{padding:"1.1vh"}}
                            onClick={() => viewModel.copyToClipboard(url)} title="Copy URL">
                            <ShareIcon/>
                        </button>
                        <RenameDatabaseDialog oldName={dbName} renameDatabase={renameDatabase} />
                        <button
                            className={"DBListingButton"}
                            onClick={() => removeDatabase(dbName)}>
                            <BinIcon/>
                        </button>
                    </div>
                ))}
                <ToastDialog
                    message="URL in die Zwischenablage kopiert!"
                    isVisible={viewModel.showToast}
                    onClose={() => viewModel.setShowToast(false)}
                />
            </div>
        );
    }
}
export default DatabaseListingView;
import type {AutomergeUrl} from "@automerge/automerge-repo";
import React from "react";
import ToastDialog from "../DialogViews/ToastDialog.tsx";
import DatabaseListingViewModel from "../../ViewModels/Listing/DatabaseListingViewModel.ts";

type DatabaseListingProps = {
    databases: Map<string, AutomergeUrl>,
    openDatabase: (db: string) => void;
    removeDatabase: (db: string) => void;
}

const DatabaseListingView: React.FC<DatabaseListingProps> = ({databases, openDatabase, removeDatabase}) => {

    const viewModel = DatabaseListingViewModel();

    if (databases.size === 0) {
        return <div>Keine Datenbanken vorhanden</div>;
    } else {
        return (
            <div className="DatabaseListing">
                {/* List all available Databases which can be opened, shared or deleted */}
                {Array.from(databases).map(([db, url]) => (
                    <div className={"DatabaseAndOptions"} key={db}>
                        <button onClick={() => openDatabase(db)}>
                            {db}
                        </button>
                        <button onClick={() => viewModel.copyToClipboard(url)} title="Copy URL">
                            🔗
                        </button>
                        <button onClick={() => removeDatabase(db)}>
                            🗑️
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
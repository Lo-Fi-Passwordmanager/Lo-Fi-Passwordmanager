import type {AutomergeUrl} from "@automerge/automerge-repo";
import React, {useState} from "react";
import ToastDialog from "../Dialogs/ToastDialog.tsx";

type DatabaseListingProps = {
    databases: Map<string, AutomergeUrl>,
    openDatabase: (db: string) => void;
    removeDatabase: (db: string) => void;
}

const DatabaseListing: React.FC<DatabaseListingProps> = ({databases, openDatabase, removeDatabase}) => {
    const [showToast, setShowToast] = useState(false);

    if (databases.size === 0) {
        return <div>Keine Datenbanken vorhanden</div>;
    }

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url.replace("automerge:", ""));
        setShowToast(true);
    };

    return (
        <div className="DatabaseListing">
            {Array.from(databases).map(([db, url]) => (
                <div className={"DatabaseAndOptions"} key={db}>
                    <button onClick={() => openDatabase(db)}>
                        {db}
                    </button>
                    <button onClick={() => copyToClipboard(url)} title="Copy URL">
                        🔗
                    </button>
                    <button onClick={() => removeDatabase(db)}>
                        🗑️
                    </button>
                </div>
            ))}
            <ToastDialog
                message="URL in die Zwischenablage kopiert!"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
export default DatabaseListing;
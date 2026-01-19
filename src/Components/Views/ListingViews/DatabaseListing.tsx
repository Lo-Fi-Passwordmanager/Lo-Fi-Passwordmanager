import type {AutomergeUrl} from "@automerge/automerge-repo";
import React, {useState} from "react";
import ToastDialog from "../Dialogs/ToastDialog.tsx";
import {removeDatabase} from "../../../Utility/Storage.ts";

type DatabaseListingProps = {
    databases: Map<string, AutomergeUrl>,
    openDatabase: (db: string) => void;
}

const DatabaseListing: React.FC<DatabaseListingProps> = ({databases, openDatabase}) => {
    const [showToast, setShowToast] = useState(false);

    if (databases.size === 0) {
        return <div>Keine Datenbanken vorhanden</div>;
    }

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url.replace("automerge:", ""));
        setShowToast(true);
    };

    return (
        <div className="listing">
            {Array.from(databases).map(([db, url]) => (
                <div
                    key={db}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "stretch"
                    }}
                >
                    <button
                        style={{ width: "100%", padding: "0.6rem", margin: "1%" }}
                        onClick={() => openDatabase(db)}
                    >
                        {db}
                    </button>
                    <button
                        style={{padding: "0.6rem", margin: "1%" }}
                        onClick={() => copyToClipboard(url)}
                        title="Copy URL"
                    >
                        🔗
                    </button>
                    <button style={{padding: "0.6rem", margin: "1%" }}
                    onClick={() => removeDatabase(db)}>
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
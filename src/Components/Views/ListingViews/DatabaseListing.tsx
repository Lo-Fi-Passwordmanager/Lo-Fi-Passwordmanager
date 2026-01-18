import React, {useEffect, useState} from "react";
import type {AutomergeUrl} from "@automerge/automerge-repo";

type DatabaseListingProps = {
    databases: Map<string, AutomergeUrl>,
    openDatabase: (db: string) => void;
}

const DatabaseListing: React.FC<DatabaseListingProps> = ({databases, openDatabase}) => {

    const [showToast, setShowToast] = useState(false);

    // Automatically hide toast after 2 seconds
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

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
                        style={{ width: "100%", margin: "auto" }}
                        onClick={() => openDatabase(db)}
                    >
                        {db}
                    </button>
                    <button
                        onClick={() => copyToClipboard(url)}
                        title="Copy URL"
                    >
                        🔗
                    </button>
                </div>
            ))}

            {showToast && (
                <div style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#333",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    fontSize: "0.9rem"
                }}>
                    URL in die Zwischenablage kopiert!
                </div>
            )}

        </div>
    );
}
export default DatabaseListing;
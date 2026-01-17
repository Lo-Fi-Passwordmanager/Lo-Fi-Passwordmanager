import React from "react";

type DatabaseListingProps = {
    databases: string[];
    openDatabase: (db: string) => void;
}

const DatabaseListing: React.FC<DatabaseListingProps> = ({databases, openDatabase}) => {

    if (databases.length === 0) {
        return <div>Keine Datenbanken vorhanden</div>;
    }

    return (
        <div className="listing">
            {databases.map((db) => (
                <button
                    style={{width: "100%", margin: "auto"}}
                    key={db + databases.indexOf(db)}
                    onClick={() => openDatabase(db)}
                >
                    {db}
                </button>
            ))}
        </div>
    )
}
export default DatabaseListing;
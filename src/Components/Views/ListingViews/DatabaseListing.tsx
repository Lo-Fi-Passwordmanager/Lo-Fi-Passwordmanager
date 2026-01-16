import React from "react";

type DatabaseListingProps = {
    databases: string[];
    onClick: (db: string) => void;
}

const DatabaseListing: React.FC<DatabaseListingProps> = ({databases, onClick}) => {

    if (databases.length === 0) {
        return <div>Keine Datenbanken vorhanden</div>;
    }

    return (
        <div className="listing">
            {databases.map((db) => (
                <button
                    style={{width: "100%", margin: "auto"}}
                    key={db + databases.indexOf(db)}
                    onClick={() => onClick(db)}
                >
                    {db}
                </button>
            ))}
        </div>
    )
}
export default DatabaseListing;
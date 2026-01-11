import React from "react";
import {Database} from "../../../Model/Database";
import OnClickButton from "../ButtonViews/OnClickButton.tsx";
import {listingStyle} from "../CSS.ts";

type DatabaseListingProps = {
    databases: Database[];
    onClick: (db: Database) => void;
}

const DatabaseListing: React.FC<DatabaseListingProps> = ({databases, onClick}) => {

    if (databases.length === 0) {
        return <div>Keine Datenbanken vorhanden</div>;
    }

    return (
        <div style={listingStyle}>
            {databases.map((db) => (
                <OnClickButton
                    key={db.id + databases.indexOf(db)}
                    onClick={() => onClick(db)}
                >
                    {db.getName()}
                </OnClickButton>
            ))}
        </div>
    )
}
export default DatabaseListing;
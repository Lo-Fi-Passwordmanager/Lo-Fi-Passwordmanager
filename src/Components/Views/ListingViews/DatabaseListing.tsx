import React from "react";
import {Database} from "../../../Model/Database";
import OnClickButton from "../ButtonViews/OnClickButton.tsx";
import {listingStyle} from "../CSS.ts";

type DatabaseListingProps = {
    databases: Database[];
    onOpen: (database: Database) => void;
}

const DatabaseListing: React.FC<DatabaseListingProps> = ({databases, onOpen}) => {

    if (databases.length === 0) {
        return <div style={listingStyle}>Keine Datenbanken vorhanden</div>;
    }

    return (
        <div style={listingStyle}>
            {databases.map((db) => (
                <OnClickButton
                    key={db.id + databases.indexOf(db)}
                    //here onClick
                >
                    {db.getName()}
                </OnClickButton>
            ))}
        </div>
    )
}
export default DatabaseListing;
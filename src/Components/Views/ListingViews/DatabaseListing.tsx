import React from "react";
import OnClickButton from "../ButtonViews/OnClickButton.tsx";
import {listingStyle} from "../CSS.ts";

type DatabaseListingProps = {
    databases: string[];
    onClick: (db: string) => void;
}

const DatabaseListing: React.FC<DatabaseListingProps> = ({databases, onClick}) => {

    if (databases.length === 0) {
        return <div>Keine Datenbanken vorhanden</div>;
    }

    return (
        <div style={listingStyle}>
            {databases.map((db) => (
                <OnClickButton
                    key={db + databases.indexOf(db)}
                    onClick={() => onClick(db)}
                >
                    {db}
                </OnClickButton>
            ))}
        </div>
    )
}
export default DatabaseListing;
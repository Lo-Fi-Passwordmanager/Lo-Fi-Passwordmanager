import React, {useEffect, useState} from 'react';
import {HiCheckCircle} from "react-icons/hi2";

import LoadingSpinner from "./LoadingSpinner.tsx";

/**
 * Icon that indicates that a merge just came in from another device
 * @param justSynced - Whether a merge just came in from another device
 */
const JustSyncedIcon: React.FC<{
    justSynced?: boolean;
}> = ({justSynced}) => {

    const [showCheckmark, setShowCheckmark] = useState<boolean>(false);

useEffect(() => {
    setTimeout(() => {
        setShowCheckmark(true);
        setTimeout(() => {
            setShowCheckmark(false);
        }, 3000);
    }, 750);
}, [justSynced]);

return (
    justSynced && <div className={"just-synced"}>
        {!showCheckmark? <LoadingSpinner header/> : <HiCheckCircle size={20} className={"check-mark"}/>}
        Synchronisiert
    </div>
)};
export default JustSyncedIcon;
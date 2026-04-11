import React, {useEffect, useState} from 'react';
import {HiCheckCircle} from "react-icons/hi2";

import LoadingSpinner from "./LoadingSpinner.tsx";
import {useTranslation} from "react-i18next";

/**
 * Icon that indicates that a merge just came in from another device
 * @param justSynced - Whether a merge just came in from another device
 */
const JustSyncedIcon: React.FC<{
    justSynced?: boolean;
}> = ({justSynced}) => {

    const [showCheckmark, setShowCheckmark] = useState<boolean>(false);
    const {t} = useTranslation();
useEffect(() => {
    setTimeout(() => {
        setShowCheckmark(true);
        setTimeout(() => {
            setShowCheckmark(false);
        }, 3500);
    }, 500);
}, [justSynced]);

return (
    justSynced && <div className={"just-synced"}>
        {!showCheckmark? <LoadingSpinner header/> : <HiCheckCircle size={20} className={"check-mark"}/>}
        {t("just_synced")}
    </div>
)};
export default JustSyncedIcon;
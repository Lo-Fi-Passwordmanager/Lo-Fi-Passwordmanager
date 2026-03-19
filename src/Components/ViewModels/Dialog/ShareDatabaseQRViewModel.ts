import {useState} from "react";

import {Settings} from "../../../Model/Settings.ts";

/**
 * The Viewmodel for {@link ShareQRDialog}
 * @param name the name that should be displayed in the QR Code
 * @param url the url that should be displayed in the QR Code
 */
export const useShareDatabaseQRViewModel = (name: string, url: string) => {

    const [shareQRCodeOpen, setShareQRCodeOpen] = useState(false);
    const [shareName, setShareName] = useState(false);

    function toggleShareName() {
        setShareName(!shareName);
    }

    //FIXME überlegen, ob man hier differenziert, welcher aktive Server übergeben wird (statt dem ersten)
    const qrValue = url.replaceAll("automerge:", "") + (shareName ? "|" + name : "") + "|" +  Settings.getSettings().getActiveServerUrls()[0];

    return {
        shareQRCodeOpen,
        setShareQRCodeOpen,
        shareName,
        toggleShareName,
        qrValue
    };
};
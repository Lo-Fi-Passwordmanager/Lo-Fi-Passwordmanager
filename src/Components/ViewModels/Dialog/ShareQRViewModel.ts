import {useState} from "react";
import {Settings} from "../../../Model/Settings.ts";

/**
 * The Viewmodel for {@link ShareQRDialog}
 * @param name the name that should be displayed in the QR Code
 * @param url the url that should be displayed in the QR Code
 */
export const useShareQRViewModel = (name: string, url: string) => {

    const [shareQRCodeOpen, setShareQRCodeOpen] = useState(false);
    const [shareName, setShareName] = useState(false);

    function toggleShareName() {
        setShareName(!shareName);
    }

    const qrValue = url.replaceAll("automerge:", "") + (shareName ? "|" + name : "") + "|" +  Settings.getSettings().getServerUrl();

    return {
        shareQRCodeOpen,
        setShareQRCodeOpen,
        shareName,
        toggleShareName,
        qrValue
    };
};
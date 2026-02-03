import {useState} from "react";

export const useShareQRViewModel = (name: string, url: string) => {

    const [shareQRCodeOpen, setShareQRCodeOpen] = useState(false);
    const [shareName, setShareName] = useState(false);

    function toggleShareName() {
        setShareName(!shareName);
    }

    const qrValue = url + (shareName ? "|" + name : "");

    return {
        shareQRCodeOpen,
        setShareQRCodeOpen,
        shareName,
        toggleShareName,
        qrValue
    };
};
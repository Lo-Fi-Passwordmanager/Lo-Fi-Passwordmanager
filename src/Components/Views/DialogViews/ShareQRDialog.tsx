import React from "react";
import {HiOutlineQrcode} from "react-icons/hi";
import Dialog from "./Dialog.tsx";
import {useShareQRViewModel} from "../../ViewModels/Dialog/ShareQRViewModel.ts";
import QRCode from "react-qr-code";


interface ShareQRDialogProps {
    name: string,
    url: string
}

const ShareQRDialog: React.FC<ShareQRDialogProps> = ({name, url}: ShareQRDialogProps) => {
    const viewmodel = useShareQRViewModel(name, url);

    if (viewmodel.shareQRCodeOpen) {
        return (
            <>
                <button
                    className="squareButton"
                    onClick={() => viewmodel.setShareQRCodeOpen(true)}>
                    <HiOutlineQrcode size={24}/>
                </button>
                <Dialog title={"Datenbank teilen"} onCloseDialog={() => viewmodel.setShareQRCodeOpen(false)}
                        className="qrDialog">
                    <p>Scanne den QR-Code auf einem anderen Gerät im "Datenbank hinzufügen" Dialog, um die Datenbank mit
                       dem Namen "{name}"
                       dort
                       hinzuzufügen.</p>
                    <label className="checkboxRow">
                        <input type="checkbox" checked={viewmodel.shareName}
                               onChange={viewmodel.toggleShareName}/>
                        Name der Datenbank auch teilen
                    </label>

                    <QRCode value={viewmodel.qrValue} className="qrCode"/>
                </Dialog>
            </>
        );
    } else {
        return (
            <button
                className="squareButton"
                onClick={() => viewmodel.setShareQRCodeOpen(true)}>
                <HiOutlineQrcode size={24}/>
            </button>
        );
    }
};
export default ShareQRDialog;
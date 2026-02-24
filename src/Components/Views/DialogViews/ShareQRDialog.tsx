import React from "react";
import {HiOutlineQrcode} from "react-icons/hi";
import QRCode from "react-qr-code";

import Dialog from "./Dialog.tsx";
import {useShareQRViewModel} from "../../ViewModels/Dialog/ShareQRViewModel.ts";

// QRCode Generator https://github.com/rosskhanas/react-qr-code

interface ShareQRDialogProps {
    name: string,
    url: string
}

/**
 * A dialog that shows a QR code to share a database.
 *
 * @param name The name of the database to share.
 * @param url The URL of the database to share.
 */
const ShareQRDialog: React.FC<ShareQRDialogProps> = ({name, url}: ShareQRDialogProps) => {
    const viewModel = useShareQRViewModel(name, url);

    if (viewModel.shareQRCodeOpen) {
        return (
            <>
                <button
                    className="squareButton"
                    onClick={() => viewModel.setShareQRCodeOpen(true)}
                >
                    <HiOutlineQrcode size={24}/>
                </button>
                <Dialog title={"Datenbank teilen"} onCloseDialog={() => viewModel.setShareQRCodeOpen(false)}
                        className="qrDialog">
                    <p>Scanne den QR-Code auf einem anderen Gerät im &quot;Datenbank hinzufügen&quot; Dialog, um die Datenbank mit
                       dem Namen &quot;{name}&quot;
                       dort
                       hinzuzufügen.</p>
                    <label className="checkboxRow">
                        <label className="switch">
                            <input type="checkbox" checked={viewModel.shareName}
                                   onChange={viewModel.toggleShareName}/>
                            <span className="slider round" />
                        </label>

                        Name der Datenbank auch teilen
                    </label>

                    <QRCode value={viewModel.qrValue} className="qrCode"/>
                </Dialog>
            </>
        );
    } else {
        return (
            <button
                className="squareButton"
                title="QR-Code anzeigen"
                onClick={() => viewModel.setShareQRCodeOpen(true)}>
                <HiOutlineQrcode size={24}/>
            </button>
        );
    }
};
export default ShareQRDialog;
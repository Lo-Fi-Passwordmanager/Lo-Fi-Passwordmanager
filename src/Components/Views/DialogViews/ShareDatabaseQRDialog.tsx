import React from "react";
import {HiOutlineQrcode} from "react-icons/hi";
// @ts-expect-error This library has a problem with vite 8.0.0 and above, this seems to fix that
import {QRCode} from "react-qr-code";

import Dialog from "./Dialog.tsx";
import {useShareDatabaseQRViewModel} from "../../ViewModels/Dialog/ShareDatabaseQRViewModel.ts";
import SliderCheckBox from "../ButtonViews/SliderCheckBox.tsx";

// QRCode Generator https://github.com/rosskhanas/react-qr-code

interface ShareDatabaseQRDialogProps {
    name: string,
    url: string
}

/**
 * A dialog that shows a QR code to share a database.
 *
 * @param name The name of the database to share.
 * @param url The URL of the database to share.
 */
const ShareDatabaseQRDialog: React.FC<ShareDatabaseQRDialogProps> = ({name, url}: ShareDatabaseQRDialogProps) => {
    const viewModel = useShareDatabaseQRViewModel(name, url);

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
                    <p>Scanne den QR-Code auf einem anderen Gerät im &quot;Datenbank hinzufügen&quot; Dialog, um die
                       Datenbank mit
                       dem Namen &quot;{name}&quot;
                       dort
                       hinzuzufügen.</p>
                    <label className="checkboxRow">
                        <SliderCheckBox checked={viewModel.shareName} toggleChecked={viewModel.toggleShareName}/>
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
export default ShareDatabaseQRDialog;
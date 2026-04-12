import {QRCodeSVG} from "qrcode.react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {HiOutlineQrcode} from "react-icons/hi";

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
    const {t} = useTranslation();

    if (viewModel.shareQRCodeOpen) {
        return (
            <>
                <button
                    className="squareButton"
                    onClick={() => viewModel.setShareQRCodeOpen(true)}
                >
                    <HiOutlineQrcode size={24}/>
                </button>
                <Dialog title={t("share_db.title")} onCloseDialog={() => viewModel.setShareQRCodeOpen(false)}
                        className="qrDialog">
                    <p><Trans i18nKey={"share_db.scan_qr"}
                              values={{
                                  name: name
                              }}
                    /></p>
                    <label className="checkboxRow" style={{marginBottom: "15px"}}>
                        <SliderCheckBox checked={viewModel.shareName} toggleChecked={viewModel.toggleShareName}/>
                        {t("share_db.share_name")}
                    </label>

                    <QRCodeSVG value={viewModel.qrValue} size={256} className="qrCode"/>
                </Dialog>
            </>
        );
    } else {
        return (
            <button
                className="squareButton"
                title={t("common.show_qr")}
                onClick={() => viewModel.setShareQRCodeOpen(true)}>
                <HiOutlineQrcode size={24}/>
            </button>
        );
    }
};
export default ShareDatabaseQRDialog;
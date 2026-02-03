import React from "react";
import {HiOutlineQrcode} from "react-icons/hi";
import Dialog from "./Dialog.tsx";
import {useQRScannerViewModel} from "../../ViewModels/Dialog/qrScannerViewModel.ts";

const QRScannerDialog: React.FC = () => {
    const viewmodel = useQRScannerViewModel();

    if (viewmodel.qrScannerOpen) {
        return (
            <>
                <button
                    className="qrButton"
                    onClick={() => viewmodel.setQRScannerOpen(true)}>
                    <HiOutlineQrcode size={24}/>
                </button>
                <Dialog title={"QR Code Scanner"} onCloseDialog={() => viewmodel.setQRScannerOpen(false)}
                        className="qrDialog">
                    <video id="qrVideo"/>
                </Dialog>
            </>
        );
    } else {
        return (
            <button
                className="qrButton"
                onClick={() => viewmodel.setQRScannerOpen(true)}>
                <HiOutlineQrcode size={24}/>
            </button>
        );
    }
};
export default QRScannerDialog;
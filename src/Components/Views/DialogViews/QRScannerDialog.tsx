import React from "react";
import {HiOutlineQrcode} from "react-icons/hi";
import Dialog from "./Dialog.tsx";
import {useQRScannerViewModel} from "../../ViewModels/Dialog/qrScannerViewModel.ts";

const QRScannerDialog: React.FC<{ setInputFields: (name: string, url: string) => void }> = ({setInputFields}) => {
    const viewmodel = useQRScannerViewModel(setInputFields);

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
                    {viewmodel.scanError && <p id="error">Ungültiger QR Code</p>}
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
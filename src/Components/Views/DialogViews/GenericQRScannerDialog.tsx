import React from "react";
import {HiOutlineQrcode} from "react-icons/hi";

import Dialog from "./Dialog.tsx";
import useGenericQRScannerViewModel, {
    type GenericQRScannerCallback
} from "../../ViewModels/Dialog/GenericQRScannerViewModel.ts";

export type GenericQRScannerDialogProps = {
    title?: string
    callback: GenericQRScannerCallback,
    closeScannerOnSuccess?: boolean
}

/**
 * A dialog that allows the user to scan a QR code of a shared database.
 *
 * @param setInputFields Function to set the input fields based on the scanned QR code.
 */
const GenericQRScannerDialog: React.FC<GenericQRScannerDialogProps> = ({
    title,
    callback,
    closeScannerOnSuccess
}: GenericQRScannerDialogProps) => {
    const viewModel = useGenericQRScannerViewModel(callback, closeScannerOnSuccess);

    if (viewModel.qrScannerOpen) {
        return (
            <>
                <button
                    className="qrButton"
                    onClick={() => viewModel.setQRScannerOpen(true)}>
                    <HiOutlineQrcode size={24}/>
                </button>
                <Dialog title={title ?? "QR Code Scanner"} onCloseDialog={() => viewModel.setQRScannerOpen(false)}
                        className="qrDialog">
                    <video id="qrVideo"/>
                    {viewModel.scanError && <p id="error">Ungültiger QR Code</p>}
                </Dialog>
            </>
        );
    } else {
        return (
            <button
                className="qrButton"
                onClick={() => viewModel.setQRScannerOpen(true)}>
                <HiOutlineQrcode size={24}/>
            </button>
        );
    }
};
export default GenericQRScannerDialog;
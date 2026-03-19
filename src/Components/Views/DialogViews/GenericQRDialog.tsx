import React, {type PropsWithChildren} from "react";
import {HiOutlineQrcode} from "react-icons/hi";
import QRCode from "react-qr-code";

import Dialog from "./Dialog.tsx";
import {useGenericDialogViewModel} from "../../ViewModels/Dialog/GenericDialogViewModel.ts";

// QRCode Generator https://github.com/rosskhanas/react-qr-code

interface GenericQRDialogProps {
    title?: string,
    qrValue: string
}

/**
 * A dialog that shows a QR code.
 *
 * @param qrValue The value the QR Code should contain.
 */
const GenericQRDialog: React.FC<GenericQRDialogProps & PropsWithChildren> = ({
    title,
    qrValue,
    children
}: GenericQRDialogProps & PropsWithChildren) => {
    const viewModel = useGenericDialogViewModel();

    if (viewModel.isOpen) {
        return (
            <>
                <button
                    className="squareButton"
                    onClick={() => viewModel.setIsOpen(true)}
                >
                    <HiOutlineQrcode size={24}/>
                </button>
                <Dialog title={title ?? "QR Code"} onCloseDialog={() => viewModel.setIsOpen(false)}
                        className="qrDialog">
                    {children}
                    <QRCode value={qrValue} className="qrCode"/>
                </Dialog>
            </>
        );
    } else {
        return (
            <button
                className="squareButton"
                title="QR-Code anzeigen"
                onClick={() => viewModel.setIsOpen(true)}>
                <HiOutlineQrcode size={24}/>
            </button>
        );
    }
};
export default GenericQRDialog;
import React, {type PropsWithChildren} from "react";
import {HiOutlineQrcode} from "react-icons/hi";
// @ts-expect-error This library has a problem with vite 8.0.0 and above, this seems to fix that
import Dialog from "./Dialog.tsx";
import {useGenericDialogViewModel} from "../../ViewModels/Dialog/GenericDialogViewModel.ts";
import {QRCodeSVG} from "qrcode.react";

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
                    <QRCodeSVG value={qrValue} size={256} className="qrCode"/>
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
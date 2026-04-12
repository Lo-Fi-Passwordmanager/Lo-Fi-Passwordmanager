import {QRCodeSVG} from "qrcode.react";
import React, {type PropsWithChildren} from "react";
import {HiOutlineQrcode} from "react-icons/hi";

import Dialog from "./Dialog.tsx";
import {useGenericDialogViewModel} from "../../ViewModels/Dialog/GenericDialogViewModel.ts";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation();

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
                title={t("common.show_qr")}
                onClick={() => viewModel.setIsOpen(true)}>
                <HiOutlineQrcode size={24}/>
            </button>
        );
    }
};
export default GenericQRDialog;
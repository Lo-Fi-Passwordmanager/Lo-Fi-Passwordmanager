import QrScanner from "qr-scanner";
import {useEffect, useRef, useState} from "react";

// QRScanner https://github.com/nimiq/qr-scanner

export type GenericQRScannerCallback = (qrValue: string, setScanError: (error: boolean) => void, setScannerOpen: (open: boolean) => void) => void
export type GenericQRScannerViewModel = {
    qrScannerOpen: boolean,
    setQRScannerOpen: (open: boolean) => void,
    scanError: boolean
}

/**
 * The Viewmodel for {@link QRScannerDialog}
 * @param setInputFields sets the arguments (name and url) for the given Database to the values of the scanned QR Code
 */
const useGenericQRScannerViewModel = (callback: GenericQRScannerCallback): GenericQRScannerViewModel => {

    const [qrScannerOpen, setQRScannerOpen_real] = useState(false);
    const [scanError, setScanError] = useState(false);

    const qrScanner = useRef<QrScanner | null>(null);

    useEffect(() => {
        if (qrScannerOpen) {
            const videoStream = document.getElementById("qrVideo")! as HTMLVideoElement;

            qrScanner.current = new QrScanner(videoStream, result => {
                if (result) {
                    callback(result.data, setScanError, setQRScannerOpen_real);
                } else {
                    setScanError(true);
                }
            }, {
                highlightScanRegion: true,
                highlightCodeOutline: true,
                preferredCamera: "environment",
                returnDetailedScanResult: true
            });
            void qrScanner.current.start();
        }
    }, [qrScannerOpen, callback]);

    function setQRScannerOpen(open: boolean) {
        if (open) {
            setQRScannerOpen_real(open);
        } else {
            if (qrScanner.current) {
                qrScanner.current.stop();
                qrScanner.current.destroy();

                qrScanner.current = null;
            }

            setQRScannerOpen_real(open);
        }
    }

    return {
        qrScannerOpen,
        setQRScannerOpen,
        scanError
    };
};
export default useGenericQRScannerViewModel;
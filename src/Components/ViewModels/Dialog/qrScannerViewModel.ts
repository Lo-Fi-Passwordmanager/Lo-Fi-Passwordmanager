import {useEffect, useState} from "react";
import QrScanner from "qr-scanner";
import {isValidAutomergeUrl} from "@automerge/react";

export const useQRScannerViewModel = () => {

    const [qrScannerOpen, setQRScannerOpen_real] = useState(false);

    let qrScanner: QrScanner | null = null;

    let url = "";
    let name = "";

    useEffect(() => {
        if (qrScannerOpen) {
            const videoStream = document.getElementById("qrVideo")! as HTMLVideoElement;

             
            qrScanner = new QrScanner(videoStream, result => {
                if (result) {

                    const regex = new RegExp(`^(?<url>\\w+)(?:\\|(?<name>.*?))?$`);
                    const match = result.data.match(regex);

                    if (match === null) {
                        return;
                    }

                    if (match.groups) {
                        url = match.groups["url"];
                        name = match.groups["name"];

                        console.log(url, name);
                    }

                    isValidAutomergeUrl("automerge:" + result.data);
                }
            }, {
                highlightScanRegion: true,
                highlightCodeOutline: true

            });
            qrScanner.start();
        }
    }, [qrScannerOpen]);

    function setQRScannerOpen(open: boolean) {
        if (open) {
            setQRScannerOpen_real(true);
        } else {
            if (qrScanner) {
                qrScanner.stop();
                qrScanner.destroy();
                qrScanner = null;
            }

            setQRScannerOpen_real(false);
        }
    }

    return {
        qrScannerOpen,
        setQRScannerOpen,
        url,
        name
    };
};
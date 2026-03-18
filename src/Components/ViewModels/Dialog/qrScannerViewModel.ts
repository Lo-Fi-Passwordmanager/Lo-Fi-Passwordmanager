import {isValidAutomergeUrl} from "@automerge/react";
import QrScanner from "qr-scanner";
import {useEffect, useRef, useState} from "react";

import {Settings} from "../../../Model/Settings.ts";

// QRScanner https://github.com/nimiq/qr-scanner

/**
 * The Viewmodel for {@link QRScannerDialog}
 * @param setInputFields sets the arguments (name and url) for the given Database to the values of the scanned QR Code
 */
const useQRScannerViewModel = (setInputFields: (name: string, url: string) => void) => {

    const [qrScannerOpen, setQRScannerOpen_real] = useState(false);
    const [scanError, setScanError] = useState(false);

    const qrScanner = useRef<QrScanner | null>(null);

    useEffect(() => {
        if (qrScannerOpen) {
            const videoStream = document.getElementById("qrVideo")! as HTMLVideoElement;

            qrScanner.current = new QrScanner(videoStream, result => {
                if (result) {

                    const regex = new RegExp("^(?<url>[^|]+)(\\|(?<name>[^|]*))?\\|(?<syncUrl>wss://.+)$");
                    const match = result.data.match(regex);

                    if (match === null) {
                        setScanError(true);
                        return;
                    }

                    if (match.groups) {
                        const url = match.groups["url"];
                        const name = match.groups["name"] ?? "";
                        const syncUrl = match.groups["syncUrl"];
                        if (isValidAutomergeUrl("automerge:" + url)) {
                            const settings = Settings.getSettings();

                            let existingServerName: string | undefined;
                            for (const [sName, sUrl] of settings.getServerUrls()) {
                                if (sUrl === syncUrl) {
                                    existingServerName = sName;
                                    break;
                                }
                            }
                            if (existingServerName) {
                                settings.activateServer(existingServerName);
                            } else {
                                settings.addServer(syncUrl, syncUrl);
                                settings.activateServer(syncUrl);
                            }
                            setInputFields(name, url);
                            setQRScannerOpen_real(false);
                            setScanError(false);
                        } else {
                            setScanError(true);
                        }
                    }
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
    }, [qrScannerOpen, setInputFields]);

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
export default useQRScannerViewModel;
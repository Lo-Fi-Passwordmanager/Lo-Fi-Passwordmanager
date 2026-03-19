import {isValidAutomergeUrl} from "@automerge/react";

import useGenericQRScannerViewModel, {
    type GenericQRScannerCallback,
    type GenericQRScannerViewModel
} from "./GenericQRScannerViewModel.ts";
import {Settings} from "../../../Model/Settings.ts";

// QRScanner https://github.com/nimiq/qr-scanner

/**
 * The Viewmodel for {@link QRScannerDialog}
 * @param setInputFields sets the arguments (name and url) for the given Database to the values of the scanned QR Code
 */
const useDatabaseQRScannerViewModel = (setInputFields: (name: string, url: string) => void): GenericQRScannerViewModel => {

    const callback: GenericQRScannerCallback = (data, setScanError) => {

        const regex = new RegExp("^(?<url>[^|]+)(\\|(?<name>[^|]*))?\\|(?<syncUrl>wss://.+)$");
        const match = data.match(regex);

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
            } else {
                setScanError(true);
            }
        }
    };

    return useGenericQRScannerViewModel(callback, true);
};
export default useDatabaseQRScannerViewModel;
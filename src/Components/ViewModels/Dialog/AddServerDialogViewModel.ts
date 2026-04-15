import React from "react";
import {useTranslation} from "react-i18next";

import {useToast} from "../Provider/ToastProviderViewModel.ts";

/**
 * The view model for the AddServerDialog component. It manages the state and logic for adding a new server.
 *
 * @param onAddServer method that is called when the user adds a new server. It receives the server name and URL as parameters.
 * @param onClose method that is called when the dialog is closed.
 * @param setShowToast method that is called to show or hide a toast message.
 * @param setToastMessage method that is called to set the message of a toast.
 */
const useAddServerDialogViewModel = (
    onAddServer: (name: string, url: string) => void,
    servers: Map<string, string>,
    onClose: () => void,
) => {
    const [name, setName] = React.useState("");
    const [url, setUrl] = React.useState("");
    const [showToast, _] = useToast()
    const {t} = useTranslation();

    const handleAddServer = () => {
        if (name.trim() === "" || url.trim() === "") {
            showToast(t("settings.server.add_server.empyt_url"));
            return;
        } else if (servers.get(name.trim())) {
            showToast(t("settings.server.add_server.duplicate_name"));
            return;
        } else if ((new Set(servers.values())).has(url.trim())) {
            showToast(t("settings.server.add_server.duplicate_url"));
            return;
        } else if (!validateWsUrl(url.trim())) {
            showToast(t("settings.server.add_server.invalid_url"));
            return;
        }

        const trimTrailingBackslash = RegExp("/$", "g");

        onAddServer(name.trim(), url.trim().replaceAll(trimTrailingBackslash, ""));
        onClose();
    };

    /**
     * Validates if the given URL string is a valid WebSocket URL (ws:// or wss://).
     * @param urlString
     */
    function validateWsUrl(urlString: string): boolean {
        try {
            const url = new URL(urlString);
            return url.protocol === "ws:" || url.protocol === "wss:";
        } catch {
            return false;
        }
    }

    return {
        name,
        setName,
        url,
        setUrl,
        handleAddServer
    };
};
export default useAddServerDialogViewModel;
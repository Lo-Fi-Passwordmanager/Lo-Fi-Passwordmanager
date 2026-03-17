import React from "react";

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
    setShowToast: (show: boolean) => void,
    setToastMessage: (message: string) => void
) => {
    const [name, setName] = React.useState("");
    const [url, setUrl] = React.useState("");

    const handleAddServer = () => {
        if (name.trim() === "" || url.trim() === "") {
            setToastMessage("Name und URL dürfen nicht leer sein.");
            setShowToast(true);
            return;
        } else if (servers.get(name.trim())) {
            setToastMessage("Ein Server mit diesem Namen existiert bereits.");
            setShowToast(true);
            return;
        } else if ((new Set(servers.values())).has(url.trim())) {
            setToastMessage(`Ein Server mit dieser URL existiert bereits.`);
            setShowToast(true);
            return;
        } else if (!validateWsUrl(url.trim())) {
            setToastMessage("Invalide URL. Bitte gültige Websocket URL eingeben.");
            setShowToast(true);
            return;
        }

        onAddServer(name.trim(), url.trim());
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
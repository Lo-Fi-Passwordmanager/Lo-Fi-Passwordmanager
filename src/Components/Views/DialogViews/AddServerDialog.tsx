import React from "react";
import Dialog from "./Dialog.tsx";

/**
 * A dialog that allows the user to add a new server by specifying its name and URL.
 *
 * @param onAddServer method that is called when the user adds a new server. It receives the server name and URL as parameters.
 * @param onClose method that is called when the dialog is closed.
 */
const AddServerDialog: React.FC<{
    onAddServer: (name: string, url: string) => void,
    onClose: () => void
}> = ({onAddServer, onClose}) => {
    const [name, setName] = React.useState("");
    const [url, setUrl] = React.useState("");

    const handleAddServer = () => {
        if (url.trim() !== "" && name.trim() !== "") {
            onAddServer(name.trim(), url.trim());
            onClose();
        }
    };

    return (
        <Dialog title="Server hinzufügen" onCloseDialog={onClose}>
            <div className="addServerWrapper">
                <label>
                    Server Name:
                    <input
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Mein Server"
                    />
                    Server URL:
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="wss://my-server.org"
                    />
                </label>
                <div className="dialogActions">
                    <button  className={"rectangle-button"} onClick={handleAddServer}>
                        Hinzufügen
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
export default AddServerDialog;
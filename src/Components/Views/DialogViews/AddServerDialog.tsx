import React from "react";
import Dialog from "./Dialog.tsx";

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
                        placeholder="wws://my-server.org"
                    />
                </label>
                <div className="dialogActions">
                    <button className="rectangleButton" onClick={handleAddServer}>
                        Hinzufügen
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
export default AddServerDialog;
import React from "react";
import Dialog from "./Dialog.tsx";

const AddServerDialog: React.FC<{
    onAddServer: (url: string) => void,
    onClose: () => void
}> = ({onAddServer, onClose}) => {
    const [url, setUrl] = React.useState("");

    const handleAddServer = () => {
        if (url.trim() !== "") {
            onAddServer(url.trim());
            onClose();
        }
    };

    return (
        <Dialog title="Server hinzufügen" onCloseDialog={onClose}>
            <div className="addServerWrapper">
                <label>
                    Server URL:
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/server"
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
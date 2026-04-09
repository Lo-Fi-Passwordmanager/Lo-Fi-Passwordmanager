import React from "react";

import Dialog from "./Dialog.tsx";
import useAddServerDialogViewModel from "../../ViewModels/Dialog/AddServerDialogViewModel.ts";

/**
 * A dialog that allows the user to add a new server by specifying its name and URL.
 *
 * @param onAddServer method that is called when the user adds a new server. It receives the server name and URL as parameters.
 * @param onClose method that is called when the dialog is closed.
 * @param setShowToast method that is called to show or hide a toast message.
 * @param setToastMessage method that is called to set the message of a toast.
 */
const AddServerDialog: React.FC<{
    onAddServer: (name: string, url: string) => void,
    servers: Map<string, string>,
    onClose: () => void,
}> = ({onAddServer, servers, onClose}) => {

    const viewModel = useAddServerDialogViewModel(onAddServer, servers, onClose);

    return (
        <Dialog title="Server hinzufügen" onCloseDialog={onClose}>
            <div className="addServerWrapper">
                <label>Server Name:</label>
                <input
                    autoFocus
                    type="text"
                    value={viewModel.name}
                    onChange={(e) => viewModel.setName(e.target.value)}
                    placeholder="Mein Server"
                />
                <label>Server URL:</label>
                <input
                    type="text"
                    value={viewModel.url}
                    onChange={(e) => viewModel.setUrl(e.target.value)}
                    placeholder="wss://my.sync-server.org"
                />
                <button className={"rectangle-button dialog-confirm"} onClick={viewModel.handleAddServer}>
                    Hinzufügen
                </button>
            </div>
        </Dialog>
    );
};
export default AddServerDialog;
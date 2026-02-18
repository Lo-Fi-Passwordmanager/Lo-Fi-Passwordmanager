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
    onClose: () => void,
    setToastMessage: (message: string) => void,
    setShowToast: (show: boolean) => void
}> = ({onAddServer, onClose, setShowToast, setToastMessage}) => {

    const viewModel = useAddServerDialogViewModel(onAddServer, onClose, setShowToast, setToastMessage);

    return (
        <Dialog title="Server hinzufügen" onCloseDialog={onClose}>
            <div className="addServerWrapper">
                <label>
                    Server Name:
                    <input
                        autoFocus
                        type="text"
                        value={viewModel.name}
                        onChange={(e) => viewModel.setName(e.target.value)}
                        placeholder="Mein Server"
                    />
                    Server URL:
                    <input
                        type="text"
                        value={viewModel.url}
                        onChange={(e) => viewModel.setUrl(e.target.value)}
                        placeholder="wss://my.sync-server.org"
                    />
                </label>
                <div className="dialogActions">
                    <button className={"rectangle-button"} onClick={viewModel.handleAddServer}>
                        Hinzufügen
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
export default AddServerDialog;
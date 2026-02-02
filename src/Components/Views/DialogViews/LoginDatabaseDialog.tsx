import React from "react";
import {useLoginDatabaseViewModel} from "../../ViewModels/Dialog/LoginDatabaseViewModel.ts";
import Dialog from "./Dialog.tsx";
import EyeButton from "../ButtonViews/EyeButton.tsx";


const LoginDatabaseDialog: React.FC<{
    isOpen: boolean,
    title: string,
    label1: string,
    onConfirm: (field1: string) => void,
    onCancel: () => void,
    setToastMessage: (message: string) => void,
    setShowToast: (message: boolean) => void,
    hidePassword: boolean,
    toggleHidePassword: () => void,
}> = ({
          isOpen,
          title,
          label1,
          onConfirm,
          onCancel,
          setToastMessage,
          setShowToast,
          hidePassword,
          toggleHidePassword
      }) => {

    const viewModel = useLoginDatabaseViewModel(isOpen, onConfirm, setToastMessage, setShowToast);

    if (!isOpen) return null;

    return (
        <Dialog title={title} onCloseDialog={onCancel}>
            <label>{label1}</label>
            <div className={"password-container"}>
                <input
                    type={hidePassword ? "password" : "text"}
                    value={viewModel.field1}
                    onChange={(e) => viewModel.setField1(e.target.value)}
                    placeholder={label1}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            viewModel.handleConfirm();
                        }
                        if (e.key === 'Escape') {
                            onCancel();
                        }
                    }}
                />
                <EyeButton hidePassword={hidePassword} toggleHidePassword={toggleHidePassword} size={49}/>
            </div>
            <div className="confirm-cancel-buttons">
                <button onClick={viewModel.handleConfirm}>Bestätigen</button>
                <button onClick={onCancel}>Abbrechen</button>
            </div>
        </Dialog>
    );
};
export default LoginDatabaseDialog;
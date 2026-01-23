import React from "react";
import {
    type TwoFieldDialogProps,
    useCreateDatabaseViewModel
} from "../../ViewModels/Dialog/CreateDatabaseViewModel.ts";


const CreateDatabaseDialog: React.FC<TwoFieldDialogProps> = ({
                                                                 isOpen,
                                                                 title,
                                                                 label1,
                                                                 label2,
                                                                 createDatabase,
                                                                 onCancel,
                                                                 storeDatabase,
                                                                 setToastMessage,
                                                                 setShowToast,
                                                             }: TwoFieldDialogProps) => {

    const viewModel = useCreateDatabaseViewModel(isOpen, createDatabase, storeDatabase, setToastMessage, setShowToast);

    if (!isOpen) return null;

    if (viewModel.createNewDatabase) {
        return (
            <div className="dialogOverlay">
                <div className="dialog">
                    <button onClick={() => viewModel.setCreateNewDatabase(false)}>Existierende Datenbank laden</button>
                    <h3>{title}</h3>
                    <label>{label1}</label>
                    <input
                        type="text"
                        value={viewModel.field1}
                        onChange={(e) => viewModel.setField1(e.target.value)}
                        placeholder={label1}
                        autoFocus
                    />

                    <label>{label2}</label>
                    <input
                        type="password"
                        value={viewModel.field2}
                        onChange={(e) => viewModel.setField2(e.target.value)}
                        placeholder={label2}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {viewModel.handleConfirm();}
                        }}
                    />
                    <div className="confirm-cancel-buttons">
                        <button onClick={viewModel.handleConfirm}>Bestätigen</button>
                        <button onClick={onCancel} style={{background:"gray"}}>Abbrechen</button>
                    </div>
                </div>
            </div>
        );


    } else {
        return (
            <div className="dialogOverlay">
                <div className="dialog">
                    <button onClick={() => viewModel.setCreateNewDatabase(true)}>Neue Datenbank erstellen</button>
                    <h3>Existierende Datenbank laden</h3>
                    <label>Name</label>
                    <input
                        type="text"
                        value={viewModel.field1}
                        onChange={(e) => viewModel.setField1(e.target.value)}
                        placeholder={"Name"}
                        autoFocus
                    />
                    <label>Automerge Url</label>
                    <input
                        type="text"
                        value={viewModel.field2}
                        onChange={(e) => viewModel.setField2(e.target.value)}
                        placeholder={"Automerge Url"}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {viewModel.handleConfirm();}
                        }}
                    />
                    <div className="confirm-cancel-buttons">
                        <button onClick={viewModel.handleConfirm}>Bestätigen</button>
                        <button onClick={onCancel}>Abbrechen</button>
                    </div>
                </div>
            </div>
        );
    }

}
export default CreateDatabaseDialog;
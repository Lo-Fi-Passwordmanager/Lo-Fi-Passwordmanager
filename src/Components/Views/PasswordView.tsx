import React from "react";
import ListView from "./ListView.tsx";
import EntryView from "./EntryView.tsx";
import {usePasswortViewModel} from "../ViewModels/PasswordViewModel.ts";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import ItemCreationDialog from "./Dialogs/ItemCreationDialog.tsx";
import ToastDialog from "./Dialogs/ToastDialog.tsx";
import EditablePasswordView from "./EditablePasswordView.tsx";

interface PasswordViewProps {
    automergeFacade?: AutomergeFacade | null;
}

/**
 * The view that should be shown, when the user opened a database successfully and shows the whole structure and one selected entry
 */
const PasswordView: React.FC<PasswordViewProps> = ({automergeFacade}) => {
    const passwordViewModel = usePasswortViewModel(automergeFacade as AutomergeFacade);

    return (
        <div>
            {passwordViewModel.getInItemCreation() &&
                <ItemCreationDialog
                    addItem={passwordViewModel.addItem}
                    curParent={passwordViewModel.getCurParent()}
                    cancelItemCreation={() => passwordViewModel.setInItemCreation(false)}
                    setCurItem={passwordViewModel.setCurItem}
                />}
            <div className="passwordView">
                <div className="borderBox scrollableContainer" style={{width: "30%"}}>
                    <ListView
                        item={passwordViewModel.getRootFolder()}
                        setCurItem={passwordViewModel.setCurItem}
                        setItemCreationDialog={() => passwordViewModel.setInItemCreation(true)}
                        setCurrentParent={passwordViewModel.setCurParent}
                        deleteItem={passwordViewModel.deleteItem}
                        selectedEntryId={passwordViewModel.getCurEntry().id}
                        dirtyItemId={passwordViewModel.dirtyItemId}
                    />
                </div>
                <div className="borderBox" style={{width: "70%"}}>
                    {!passwordViewModel.inEditable &&
                        <EntryView item={passwordViewModel.getCurEntry()}
                                   copyAndClearClipboard={passwordViewModel.copyToClipboardAndClear}
                                   setEditableView={() => passwordViewModel.setInEditable(true)}/>}

                    {passwordViewModel.inEditable &&
                        <EditablePasswordView item={passwordViewModel.getCurEntry()}
                                              updateItemAttribute={passwordViewModel.updateItemAttribute}
                                              copyAndClearClipboard={passwordViewModel.copyToClipboardAndClear}
                                              setEditableView={() => passwordViewModel.setInEditable(false)}/>}
                </div>
                <ToastDialog message={passwordViewModel.toastMessage}
                             isVisible={passwordViewModel.toastVisible}
                             onClose={() => passwordViewModel.setToastVisible(false)}>
                </ToastDialog>
            </div>
        </div>
    );

};

export default PasswordView;
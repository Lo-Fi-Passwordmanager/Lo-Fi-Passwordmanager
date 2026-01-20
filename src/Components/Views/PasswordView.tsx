import React from "react";
import ListView from "./ListView.tsx";
import EntryView from "./EntryView.tsx";
import {usePasswortViewModel} from "../ViewModels/PasswordViewModel.ts";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import ItemCreationDialog from "./Dialogs/ItemCreationDialog.tsx";

interface PasswordViewProps {
    automergeFacade?: AutomergeFacade | null
}

/**
 * The view that should be shown, when the user opened a database successfully and shows the whole structure and one selected entry
 */
const PasswordView: React.FC<PasswordViewProps> = ({automergeFacade}) => {
    const passwordViewModel = usePasswortViewModel(automergeFacade as AutomergeFacade);
    // Zu testzwecken eingefügt
    // const facade = useAutomergeFacade(automergeFacade)

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
                    />
                </div>
                <div className="borderBox" style={{width: "70%"}}>
                    <EntryView item={passwordViewModel.getCurEntry()}
                    />
                </div>
            </div>
        </div>
    );

}

export default PasswordView;
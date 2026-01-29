import React from "react";
import ListView from "./ListView.tsx";
import EntryView from "./EntryView.tsx";
import OrganizeListView from "./OrganizeListView.tsx";
import {usePasswortViewModel} from "../ViewModels/PasswordViewModel.ts";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import ItemCreationDialog from "./DialogViews/ItemCreationDialog.tsx";
import ToastDialog from "./DialogViews/ToastDialog.tsx";
import EditablePasswordView from "./EditablePasswordView.tsx";
import FilteredListView from "./FilteredListView.tsx";
import SettingsView from "./SettingsView.tsx";
import {useRepo} from "@automerge/automerge-repo-react-hooks";


interface PasswordViewProps {
    automergeFacade?: AutomergeFacade | null,
    openedDbName: string,
    closeDatabase: () => void
}

/**
 * The view that should be shown, when the user opened a database successfully and shows the whole structure and one selected entry
 */
const PasswordView: React.FC<PasswordViewProps> = ({automergeFacade, openedDbName, closeDatabase}) => {
    const passwordViewModel = usePasswortViewModel(automergeFacade as AutomergeFacade);

    // Fügt das Repo als zu global hinzu, sodass man im Browser einfach auf das Repo zugreifen kann, zum debuggen.
    // Nur während 'yarn dev' verfügbar, nach dem build nicht mehr
    if (import.meta.env.DEV) {
        // @ts-expect-error no error
        // eslint-disable-next-line react-hooks/rules-of-hooks
        window.handle = useRepo().find(automergeFacade!.automergeURL!);
    }

    return (
        <div style={{margin: "10px", height: "95vh"}}>
            {/*Dialog for creating a new Entry*/}
            {passwordViewModel.getInItemCreation() &&
                <ItemCreationDialog
                    addItem={passwordViewModel.addItem}
                    curParent={passwordViewModel.getCurParent()}
                    cancelItemCreation={() => passwordViewModel.setInItemCreation(false)}
                    setCurItem={passwordViewModel.setCurItem}
                />}

            <div className="passwordView">
                <div className="borderBox scrollableContainer" style={{width: "30%"}}>
                    {/*Container for everything related to the search/Sort features */}
                    <OrganizeListView
                        getCurSortCriterion={passwordViewModel.getCurSortCriterion}
                        setCurSortCriterion={passwordViewModel.setAndStoreSortCriterion}
                        toggleOrder={passwordViewModel.toggleOrder}
                        isAscending={passwordViewModel.isAscending}
                        setLiveSearchValue={passwordViewModel.setSearchValue}
                        liveSearchValue={passwordViewModel.searchValue}
                        closeDatabase={closeDatabase}
                        setItemCreationDialog={() => passwordViewModel.setInItemCreation(true)}
                    />

                    <div className="scrollableContainer">

                        {/*Shows only the Views, that match the given search input*/}
                        {passwordViewModel.searchValue.length > 0 && <FilteredListView
                            root={passwordViewModel.getRootFolder()}
                            setCurItem={passwordViewModel.setCurItem}
                            deleteItem={passwordViewModel.deleteItem}
                            sortCriterion={passwordViewModel.getCurSortCriterion()}
                            isAscending={passwordViewModel.isAscending}
                            filterText={passwordViewModel.searchValue}
                            goToFolder={passwordViewModel.goToFolder}
                        />}

                        {/*The basic ListView which shows all Items and Folders in their hierarchy*/}
                        {passwordViewModel.searchValue.length === 0 &&
                            <ListView
                                item={passwordViewModel.getRootFolder()}
                                setCurItem={passwordViewModel.setCurItem}
                                setItemCreationDialog={() => passwordViewModel.setInItemCreation(true)}
                                setCurrentParent={passwordViewModel.setCurParent}
                                deleteItem={passwordViewModel.deleteItem}
                                sortCriterion={passwordViewModel.getCurSortCriterion()}
                                isAscending={passwordViewModel.isAscending}
                                dirtyItemId={passwordViewModel.dirtyItemId}
                                getCurItem={passwordViewModel.getCurEntry}
                                openedDbName={openedDbName}

                                updateItemTitle={passwordViewModel.updateItemTitle}
                            selectedFolderId={passwordViewModel.selectedFolderId}
                            />}
                    </div>

                </div>

                <div className="borderBox" style={{width: "70%", position: "relative"}}>
                    <SettingsView automergeFacade={automergeFacade}/>
                    {/*Depending on the state, either shows the editable or the normal/noneditable passwordView*/}
                    {!passwordViewModel.inEditable &&
                        <EntryView item={passwordViewModel.getCurEntry()}
                                   copyAndClearClipboard={passwordViewModel.copyToClipboardAndClear}
                                   setEditableView={() => passwordViewModel.setInEditable(true)}
                                   hidePassword={passwordViewModel.hidePassword}
                                   toggleHidePassword={passwordViewModel.toggleHidePassword}/>}

                    {passwordViewModel.inEditable &&
                        <EditablePasswordView item={passwordViewModel.getCurEntry()}
                                              updateItemAttribute={passwordViewModel.updateItemAttribute}
                                              setEditableView={() => passwordViewModel.setInEditable(false)}
                                              hidePassword={passwordViewModel.hidePassword}
                                              toggleHidePassword={passwordViewModel.toggleHidePassword}/>}
                </div>

                {/*A Toast that may be called at any time with a given message*/}
                <ToastDialog message={passwordViewModel.toastMessage}
                             isVisible={passwordViewModel.toastVisible}
                             onClose={() => passwordViewModel.setToastVisible(false)}>
                </ToastDialog>
            </div>
        </div>
    );

};

export default PasswordView;
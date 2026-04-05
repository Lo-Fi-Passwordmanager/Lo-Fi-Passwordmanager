import {useRepo} from "@automerge/automerge-repo-react-hooks";
import {DndContext, DragOverlay, pointerWithin} from "@dnd-kit/core";
import React from "react";
import {HiTrash} from "react-icons/hi";
import {HiArrowLeftCircle} from "react-icons/hi2";
import {ImKey} from "react-icons/im";

import EntryView from "./EntryView.tsx";
import ListView from "./ListView.tsx";
import OrganizeListView from "./OrganizeListView.tsx";
import type {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {usePasswordViewModel} from "../ViewModels/PasswordViewModel.ts";
import DeleteConfirmationDialog from "./DialogViews/DeleteConfirmationDialog.tsx";
import ItemCreationDialog from "./DialogViews/ItemCreationDialog.tsx";
import ToastDialog from "./DialogViews/ToastDialog.tsx";
import EditableEntryView from "./EditableEntryView.tsx";
import FilteredListView from "./FilteredListView.tsx";
import FolderMenu from "./MenuViews/FolderMenu.tsx";
import type {Item} from "../../Model/Item.ts";


interface PasswordViewProps {
    automergeFacade?: AutomergeFacade | null,
    openedDbName: string,
    closeDatabase: () => void
    itemsDeleted: string[];
    justSynced: boolean;
    itemsToImport: Item[];
}

/**
 * The view that should be shown, when the user opened a database successfully and shows the whole structure and one selected entry
 */
const PasswordView: React.FC<PasswordViewProps> = ({automergeFacade, openedDbName, closeDatabase, itemsDeleted, justSynced, itemsToImport}) => {
    const viewModel = usePasswordViewModel(automergeFacade as AutomergeFacade, itemsDeleted, justSynced);
    // Fügt das Repo als zu global hinzu, sodass man im Browser einfach auf das Repo zugreifen kann, zum debuggen.
    // Nur während 'yarn dev' verfügbar, nach dem build nicht mehr
    if (import.meta.env.DEV) {
        // @ts-expect-error no error
        // eslint-disable-next-line react-hooks/rules-of-hooks
        window.handle = useRepo().find(automergeFacade!.automergeURL!);
    }


    if (itemsToImport.length > 0 && viewModel.reactiveFacade.tree.rootFolder.items.length === 0) {
        for (const item of itemsToImport) {
            viewModel.reactiveFacade.insertItem(item, viewModel.reactiveFacade.tree.rootFolder.id);
        }
        for (let i = 0; i < itemsToImport.length; i++) {
            itemsToImport.pop();
        }
    }

    return (
        <div className={`passwordView ${viewModel.curItem.isEntry() ? 'mobile-detail-open' : ''}`}>
            {/*Dialog for creating a new Entry*/}
            {viewModel.inItemCreation &&
                <ItemCreationDialog
                    addItem={viewModel.addItem}
                    cancelItemCreation={() => viewModel.setInItemCreation(false)}
                />}
            <div className="passwordViewList">
                {/*Container for everything related to the search/Sort features */}
                <OrganizeListView
                    curSortCriterion={viewModel.curSortCrit}
                    setCurSortCriterion={viewModel.setAndStoreSortCriterion}
                    toggleOrder={viewModel.toggleOrder}
                    isAscending={viewModel.isAscending}
                    setLiveSearchValue={viewModel.setSearchValue}
                    liveSearchValue={viewModel.searchValue}
                    closeDatabase={closeDatabase}
                    isIndividualSorting={viewModel.individualSorting}
                    toggleIndividualSorting={viewModel.toggleIndividualSorting}
                />

                <div className="scrollableContainer">

                    {/*Shows only the Views, that match the given search input*/}
                    {viewModel.searchValue.length > 0 && <FilteredListView
                        root={viewModel.getRootFolder()}
                        setCurItem={viewModel.setCurItem}
                        filterText={viewModel.searchValue}
                        goToFolder={viewModel.goToItem}
                        getSortedChildren={viewModel.getSortedChildren}
                    />}
                    <DndContext collisionDetection={pointerWithin}
                                onDragEnd={viewModel.handleDragEnd}
                                onDragStart={viewModel.onDragStart}
                                sensors={viewModel.sensors}
                                autoScroll={{
                                    threshold: {
                                        x: 0,
                                        y: 1,
                                    },
                                    acceleration: 1,
                                }}
                    >
                        {/*The basic ListView which shows all Items and Folders in their hierarchy*/}
                        {viewModel.searchValue.length === 0 && <ListView
                            item={viewModel.getRootFolder()}
                            setCurItem={viewModel.setCurItem}
                            setItemCreationDialog={() => viewModel.setInItemCreation(true)}
                            setCurrentParent={viewModel.setCurParent}
                            deleteItem={viewModel.deleteItem}
                            dirtyItemId={viewModel.dirtyItemId}
                            curItem={viewModel.curItem}
                            openedDbName={openedDbName}
                            updateItemTitle={viewModel.updateItemTitle}
                            selectedItemId={viewModel.selectedItemId}
                            createdFolderId={viewModel.createdFolderId}
                            setCreatedFolderId={viewModel.setCreatedFolderId}
                            inEditable={viewModel.inEditable}
                            expandFolderId={viewModel.expandFolder}
                            collapseFolderId={viewModel.collapseFolder}
                            isFolderExpanded={viewModel.isFolderExpanded}
                            getSortedChildren={viewModel.getSortedChildren}
                            level={0}
                            individualSorting={viewModel.individualSorting}
                        />}
                        <DragOverlay>
                            {viewModel.draggedItem &&
                                <div className={`listView${viewModel.draggedItem.isEntry() ? 'Entry' : 'TitleHeader'}`}>
                                    <button style={viewModel.draggedItem.isEntry() ? {background: "transparent", boxShadow: "none"} : {}}>{viewModel.draggedItem.isEntry() ? <ImKey size={18}/> : viewModel.isFolderExpanded(viewModel.draggedItem.id) ? "▼" : "▷"}</button>
                                    <span className={"item-title"}>{viewModel.draggedItem.title}</span>
                                    <div className={"btnWrapper"}>{viewModel.draggedItem.isEntry() ? <HiTrash size={24}/> : <FolderMenu disabled onAdd={() => null} onRename={() => null} onDelete={() => null}/>}</div>
                                    </div>}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>

            <div className="passwordViewEntry">
                {/*Depending on the state, either shows the editable or the normal/noneditable passwordView*/}
                {!viewModel.inEditable &&
                    <EntryView item={viewModel.curItem}
                               deleteItem={viewModel.deleteItem}
                               copyAndClearClipboard={viewModel.copyToClipboardAndClear}
                               setEditableView={() => viewModel.toggleInEdit()}
                               hidePassword={viewModel.hidePassword}
                               toggleHidePassword={viewModel.toggleHidePassword}/>}

                {viewModel.inEditable &&
                    <EditableEntryView item={viewModel.curItem}
                                       updateItemAttribute={viewModel.updateItemAttribute}
                                       setEditableView={() => viewModel.toggleInEdit()}
                                       createItem={viewModel.createEntry}
                                       inCreation={viewModel.inEntryCreation}
                                       setInCreation={viewModel.setInEntryCreation}
                                       hidePassword={viewModel.hidePassword}
                                       toggleHidePassword={viewModel.toggleHidePassword}
                    />
                }

                <button className={`mobile-back ${viewModel.inEditable ? 'disabled' : ''}`}
                        onClick={viewModel.closeEntryOnMobile}>
                    <HiArrowLeftCircle size={24} style={{marginRight: '8px'}}/> Eintrag schließen
                </button>

            </div>

            {viewModel.itemToDelete && <DeleteConfirmationDialog
                item={viewModel.itemToDelete}
                onConfirmItem={viewModel.confirmDeletion}
                onClose={() => viewModel.setItemToDelete(null)}
            />}


            {/*A Toast that may be called at any time with a given message*/}
            <ToastDialog message={viewModel.toastMessage}
                         isVisible={viewModel.toastVisible}
                         onClose={() => viewModel.setToastVisible(false)}/>

        </div>
    );

};

export default PasswordView;
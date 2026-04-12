import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import React from "react";
import {HiTrash} from "react-icons/hi";
import {HiBars3, HiMiniPlus} from "react-icons/hi2";
import {ImKey} from "react-icons/im";

import FolderMenu from "./MenuViews/FolderMenu.tsx";
import type {Entry} from "../../Model/Entry.ts";
import type {Folder} from "../../Model/Folder.ts";
import {type Item} from "../../Model/Item.ts";
import {addRecentlyUsed} from "../../Utility/Storage.ts";
import {useListViewModel} from "../ViewModels/ListViewModel.ts";

/* eslint-disable react-hooks/refs */ //react and the eslint do not like each other: https://github.com/facebook/react/issues/34775
/**
 * The View that represents the whole database, which is represented by {@link Entry}/{@link Folder} Class Instances
 *
 * @param item The current item to be shown
 * @param setCurItem method to set the currently selected item
 * @param curItem the currently selected item
 * @param setItemCreationDialog method to open the item creation dialog
 * @param setCurrentParent method to set the current parent folder
 * @param deleteItem method to delete an item
 * @param dirtyItemId
 * @param openedDbName the name of the currently opened database
 * @param selectedItemId the id of the item that was selected and is to be highlighted
 * @param createdFolderId the id of the folder that was just created and is to be highlighted
 * @param setCreatedFolderId method to set the id of the folder that was just created
 * @param updateItemTitle method to update the title of an item
 * @param inEditable whether an entry is currently being edited
 * @param level the current level of indentation (depth in the tree)
 * @param expandFolderId method to expand a folder by its id
 * @param collapseFolderId method to collapse a folder by its id
 * @param isFolderExpanded method to check whether a folder is expanded by its id
 * @param getSortedChildren method to get the sorted children of a folder
 * @param individualSorting boolean if sorting is enabled
 */
const ListView: React.FC<{
        item: Item,
        setCurItem: (entry: Item) => void,
        curItem: Item;
        setItemCreationDialog: () => void,
        setCurrentParent?: (item: Item) => void,
        deleteItem: (item: Item) => void,
        dirtyItemId: string | null,
        openedDbName: string,
        selectedItemId: string | null;
        createdFolderId: string | null;
        setCreatedFolderId: (folderId: string | null) => void;
        updateItemTitle: (itemId: string, newTitle: string) => void;
        inEditable: boolean;
        level: number;
        expandFolderId: (folderId: string) => void;
        collapseFolderId: (folderId: string) => void;
        isFolderExpanded: (folderId: string) => boolean;
        getSortedChildren: (folder: Folder) => Item[],
        individualSorting: boolean,
    }> = ({
              item,
              setCurItem,
              curItem,
              setItemCreationDialog,
              setCurrentParent,
              deleteItem,
              dirtyItemId,
              openedDbName,
              selectedItemId,
              createdFolderId,
              updateItemTitle,
              setCreatedFolderId,
              inEditable,
              level,
              expandFolderId,
              collapseFolderId,
              isFolderExpanded,
              getSortedChildren,
              individualSorting,
          }) => {
        const viewModel = useListViewModel(item, dirtyItemId, setCurItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded);

        function addButtonPressed() {
            setItemCreationDialog();
            setCurrentParent!(item);
            expandFolderId(item.id);
        }

        // makes the dragged item follow the cursor
        const dragStyle = {
            transform: CSS.Translate.toString(viewModel.transform),
            transition: viewModel.transform ? viewModel.transition : 'none',
            opacity: viewModel.isDragging && viewModel.isCurSortCritIndividual() && individualSorting ? 0 : viewModel.isDragging ? 0.4 : 1,
            willChange: "transform",
        };

        /**
         * If the item to be shown is of type entry, than only its name will be shown
         */
        if (viewModel.isItemEntry()) {
            const entry = viewModel.getItem() as Entry;
            return (
                <div
                    className={`listViewEntry ${curItem.id !== entry.id ? "" : "selected"} ${selectedItemId === item.id ? "highlighted entry" : ""}`}
                    onClick={() => {
                        if (!inEditable) {
                            setCurItem(entry);
                            addRecentlyUsed(entry.id);
                        }
                    }}
                    style={dragStyle}
                    ref={viewModel.setNodeRef}
                    {...viewModel.attributes}
                    {...viewModel.listeners}
                    aria-selected={selectedItemId === item.id}>

                    <button style={{background: "none", boxShadow: "none"}}><ImKey size={18}/></button>
                    <span className={"item-title"}>{entry.title}</span>
                    <div className={"btnWrapper"}>
                        <button className="listViewEntry button"
                                onClick={() => deleteItem(item)}
                                onPointerDown={(e) => e.stopPropagation()}
                                disabled={inEditable}
                                title="Eintrag löschen"
                        >
                            <HiTrash size={24}/>
                        </button>
                    </div>

                    <div className={"mobile-drag"}>
                        <HiBars3 size={24}/>
                    </div>

                </div>
            )
                ;

            //If the item is a folder, than all of its children get shown recursivley by creating a {@link ListView} of all of its children.
            //Furthermore a button that extends/collapses the folder and a Button to add a new Element are shown next to the title
        } else if (viewModel.isItemFolder()) {
            return (
                <>
                    {/* Name and Buttons */}
                    <div
                        className={`listViewTitleHeader ${item.id == "" ? "database-title" : ""} ${viewModel.isOver && !viewModel.isDragging && (!individualSorting || !viewModel.isCurSortCritIndividual()) && !viewModel.isInvalidDropTarget ? "over" : ""} ${selectedItemId === item.id ? "highlighted folder" : ""}`}
                        ref={viewModel.setNodeRef}
                        style={item.id !== "" ? dragStyle : {minHeight: "2.5rem"}}
                        {...(item.id !== "" ? viewModel.listeners : {})}
                        {...(item.id !== "" ? viewModel.attributes : {})}
                        aria-selected={selectedItemId === item.id}>
                        {/* ^^^^^^^^^ using aria-selected for scrolling to the clicked folder from filtered list view */}

                        {(item.id != "") &&
                            <button style={{boxShadow: "none"}}
                                    onClick={() => viewModel.toggleExpanded()}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    title={isFolderExpanded(item.id) ? "Ordner einklappen" : "Ordner ausklappen"}
                            >
                                {isFolderExpanded(item.id) ? "▼" : "▷"}</button>}

                        {(!viewModel.inEditName && item.id !== createdFolderId) &&
                            <span className={"item-title"}>{(item.id != "") ? item.title : openedDbName}</span>
                        }
                        {(viewModel.inEditName || item.id === createdFolderId) &&
                            <input type="text"
                                   autoFocus
                                   onFocus={e => {
                                       e.target.select();
                                       viewModel.setItemTitle(item.title);
                                   }}
                                   className={"editFolder mobile"}
                                   style={{marginLeft: ((item.id != "") ? "" : "10px")}}
                                   value={viewModel.newTitle}
                                   onChange={(e) => viewModel.setItemTitle(e.target.value)}
                                   onBlur={() => {
                                       viewModel.setAndStoreEditName(false);
                                       viewModel.updateTitleInAutomerge();
                                   }}
                                   onKeyDown={(e) => {
                                       if (e.key === "Enter") {
                                           (e.target as HTMLInputElement).blur();
                                       }
                                   }}
                            />
                        }
                        <div className="btnWrapper">
                            {item.id !== "" ? <FolderMenu
                                disabled={inEditable}
                                onAdd={() => addButtonPressed()}
                                onDelete={() => deleteItem(item)}
                                onRename={() => {
                                    viewModel.setAndStoreEditName(true);
                                }}
                            /> : <button className="listViewTitleHeader button"
                                         title="Eintrag ins Startverzeichnis Hinzufügen"
                                         onClick={() => addButtonPressed()}
                                         disabled={inEditable}>
                                <HiMiniPlus size={24}/>
                            </button>}
                        </div>

                        {item.id === "" ? null : <div className={"mobile-drag folder"}>
                            <HiBars3 size={24}/>
                        </div>}

                    </div>
                    {/* Recursive call of children with indent to visualizes depth in the tree */}
                    <div className="listViewEntryWrapper"
                         style={{
                             display: (isFolderExpanded(item.id) ? "block" : "none"),
                             marginLeft: level <= 8 ? "15px" : "0px"
                         }}>
                        <SortableContext items={getSortedChildren(item as Folder).map(child => child.id)}
                                         strategy={viewModel.isCurSortCritIndividual() && individualSorting ? verticalListSortingStrategy : viewModel.doNothingStrategy}>
                            {getSortedChildren(item as Folder) &&
                                getSortedChildren(item as Folder).map((item: Item, index: number) => {
                                    return <ListView
                                        key={index}
                                        item={item}
                                        setCurItem={setCurItem}
                                        curItem={curItem}
                                        setItemCreationDialog={setItemCreationDialog}
                                        setCurrentParent={setCurrentParent}
                                        deleteItem={deleteItem}
                                        getSortedChildren={getSortedChildren}
                                        dirtyItemId={dirtyItemId} openedDbName={""}
                                        updateItemTitle={updateItemTitle}
                                        selectedItemId={selectedItemId}
                                        createdFolderId={createdFolderId}
                                        setCreatedFolderId={setCreatedFolderId}
                                        inEditable={inEditable}
                                        level={level + 1}
                                        expandFolderId={expandFolderId}
                                        collapseFolderId={collapseFolderId}
                                        isFolderExpanded={isFolderExpanded}
                                        individualSorting={individualSorting}
                                    />;
                                })}
                        </SortableContext>
                    </div>
                </>
            );
        }
    }
;

export default ListView;
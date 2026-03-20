import {CSS} from "@dnd-kit/utilities";
import React from "react";
import {HiTrash} from "react-icons/hi";
import {HiMiniPlus} from "react-icons/hi2";
import {ImKey} from "react-icons/im";

import FolderMenu from "./MenuViews/FolderMenu.tsx";
import type {Entry} from "../../Model/Entry.ts";
import type {Folder} from "../../Model/Folder.ts";
import {type Item} from "../../Model/Item.ts";
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
 */
const ListView: React.FC<{
        item: Item,
        setCurItem: (entry: Entry) => void,
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
        getSortedChildren
    }) => {
        const listViewModel = useListViewModel(item, dirtyItemId, setCurItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded);

        function addButtonPressed() {
            setItemCreationDialog();
            setCurrentParent!(item);
            expandFolderId(item.id);
        }

        // makes the dragged item follow the cursor
        const dragStyle = {
            transform: CSS.Translate.toString(listViewModel.transform)
        };

        /**
         * If the item to be shown is of type entry, than only its name will be shown
         */
        if (listViewModel.isItemEntry()) {
            const entry = listViewModel.getItem() as Entry;
            return (
                <div
                    className={`listViewEntry ${curItem.id !== entry.id ? "" : "selected"} ${listViewModel.isDragging ? "dragged" : ""} ${selectedItemId === item.id ? "highlighted entry" : ""}`}
                    onClick={() => {
                        if (!inEditable) {
                            setCurItem(entry);
                        }
                    }}
                    style={dragStyle}
                    ref={listViewModel.setDraggableRef}
                    {...listViewModel.attributes}
                    {...listViewModel.listeners}
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
                </div>
            )
                ;

            //If the item is a folder, than all of its children get shown recursivley by creating a {@link ListView} of all of its children.
            //Furthermore a button that extends/collapses the folder and a Button to add a new Element are shown next to the title
        } else if (listViewModel.isItemFolder()) {
            return (
                <>
                    {/* Name and Buttons */}
                    <div
                        className={`listViewTitleHeader ${item.id == "" ? "database_title" : ""} ${listViewModel.isDragging ? "dragged" : ""} ${listViewModel.isOver && !listViewModel.isDragging ? "over" : ""} ${selectedItemId === item.id ? "highlighted folder" : ""}`}
                        ref={listViewModel.setFolderRef}
                        style={item.id !== "" ? dragStyle : {}}
                        {...listViewModel.attributes}
                        {...listViewModel.listeners}
                        aria-selected={selectedItemId === item.id}>
                        {/* ^^^^^^^^^ using aria-selected for scrolling to the clicked folder from filtered list view */}
                        {(item.id != "") &&
                            <button style={{boxShadow: "none"}}
                                    onClick={() => listViewModel.toggleExpanded()}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    title={isFolderExpanded(item.id) ? "Ordner einklappen" : "Ordner ausklappen"}
                            >
                                {isFolderExpanded(item.id) ? "▼" : "▷"}</button>}

                        {(!listViewModel.inEditName && item.id !== createdFolderId) &&
                            <span className={"item-title"}>{(item.id != "") ? item.title : openedDbName}</span>
                        }
                        {(listViewModel.inEditName || item.id === createdFolderId) &&
                            <input type="text"
                                   autoFocus
                                   onFocus={e => {
                                       e.target.select();
                                       listViewModel.setItemTitle(item.title);
                                   }}
                                   style={{marginLeft: ((item.id != "") ? "" : "10px"), border: "none"}}
                                   value={listViewModel.newTitle}
                                   onChange={(e) => listViewModel.setItemTitle(e.target.value)}
                                   onBlur={() => {
                                       listViewModel.setAndStoreEditName(false);
                                       listViewModel.updateTitleInAutomerge();
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
                                    listViewModel.setAndStoreEditName(true);
                                }}
                            /> : <button className="listViewTitleHeader button"
                                         title="Eintrag ins Startverzeichnis Hinzufügen"
                                         onClick={() => addButtonPressed()}
                                         disabled={inEditable}>
                                <HiMiniPlus size={24}/>
                            </button>}
                        </div>
                    </div>

                    {/* Recursive call of children with indent to visualizes depth in the tree */}
                    <div className="listViewEntryWrapper"
                         style={{
                             display: (isFolderExpanded(item.id) ? "block" : "none"),
                             marginLeft: level <= 8 ? "15px" : "0px"
                         }}>
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
                                />;
                            })}
                    </div>
                </>
            );
        }
    }
;

export default ListView;
import {type Item} from "../../Model/Item.ts";
import {useListViewModel} from "../ViewModels/ListViewModel.ts";
import {Entry} from "../../Model/Entry.ts";
import React from "react";
import type {SortCriteria} from "../ViewModels/PasswordViewModel.ts";
import FolderMenu from "./MenuViews/FolderMenu.tsx";
import {HiMiniPlus} from "react-icons/hi2";
import {HiTrash} from "react-icons/hi";
import {CSS} from "@dnd-kit/utilities";

/* eslint-disable react-hooks/refs */ //react and the eslint do not like each other: https://github.com/facebook/react/issues/34775
/**
 * The View that represents the whole database, which is represented by {@link Entry}/{@link Folder} Class Instances
 * @param item the item which should be depicted, if this is a folder, all of its content is also depicted
 * @param onSetEntry the Method that selects an entry to be shown in the {@link EntryView}
 */
const ListView: React.FC<{
    item: Item,
    setCurItem: (entry: Entry) => void,
    curItem: Item;
    setItemCreationDialog: () => void,
    setCurrentParent?: (item: Item) => void,
    deleteItem: (item: Item) => void,
    sortCriterion: SortCriteria,
    isAscending: boolean,
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
}> = ({
          item,
          setCurItem,
          curItem,
          setItemCreationDialog,
          setCurrentParent,
          deleteItem,
          sortCriterion,
          isAscending,
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
          isFolderExpanded
      }) => {
    const listViewModel = useListViewModel(item, sortCriterion, isAscending, dirtyItemId, setCurItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId,collapseFolderId, isFolderExpanded);

    function addButtonPressed() {
        setItemCreationDialog();
        setCurrentParent!(item);
    }

    // makes the dragged item follow the cursor
    const dragStyle = {
        transform: CSS.Translate.toString(listViewModel.transform),
    };

    /**
     * If the item to be shown is of type entry, than only its name will be shown
     */
    if (listViewModel.isItemEntry()) {
        const entry = listViewModel.getItem() as Entry;
        return (
            <div
                className={`listViewEntry ${curItem.id !== entry.id ? "" : "selected"} ${listViewModel.isDragging ? "dragged" : ""} ${selectedItemId === item.id ? "highlighted entry" : ""}`}
                onClick={() => setCurItem(entry)}
                style={dragStyle}
                ref={listViewModel.setDraggableRef}
                {...listViewModel.attributes}
                {...listViewModel.listeners}
                aria-selected={selectedItemId === item.id}>
                <span className={"item-title"}>{entry.title}</span>
                <div className={"btnWrapper"}>
                    <button className="listViewEntry button"
                            onClick={() => deleteItem(item)}
                            onPointerDown={(e) => e.stopPropagation()}
                            disabled={inEditable}
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
                    className={`listViewTitleHeader ${listViewModel.isDragging ? "dragged" : ""} ${listViewModel.isOver && !listViewModel.isDragging ? "over" : ""} ${selectedItemId === item.id ? "highlighted folder" : ""}`}
                    ref={listViewModel.setFolderRef}
                    style={dragStyle}
                    {...listViewModel.attributes}
                    {...listViewModel.listeners}
                    aria-selected={selectedItemId === item.id}>
                    {/* ^^^^^^^^^ using aria-selected for scrolling to the clicked folder from filtered list view */}
                    {(item.id != "") &&
                        <button style={{boxShadow: "none"}}
                                onClick={() => listViewModel.toggleExpanded()}
                                onPointerDown={(e) => e.stopPropagation()}
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
                               }}
                               style={{marginLeft: ((item.id != "") ? "" : "10px"), border: "none"}}
                               value={listViewModel.newTitle}
                               onChange={(e) => listViewModel.setItemTitle(e.target.value)}
                               onBlur={() => {
                                   listViewModel.setAndStoreEditName(false);
                                   listViewModel.updateTitleInAutomerge()
                               }}
                               onKeyDown={(e) => {
                                   if (e.key === 'Enter') {
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
                        /> : <button className="listViewTitleHeader button" onClick={() => addButtonPressed()}
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
                    {listViewModel.getChildren() &&
                        listViewModel.getChildren()!.map((item: Item, index: number) => {
                            return <ListView
                                key={index}
                                item={item}
                                setCurItem={setCurItem}
                                curItem={curItem}
                                setItemCreationDialog={setItemCreationDialog}
                                setCurrentParent={setCurrentParent}
                                deleteItem={deleteItem}
                                sortCriterion={sortCriterion}
                                isAscending={isAscending}
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
};

export default ListView;
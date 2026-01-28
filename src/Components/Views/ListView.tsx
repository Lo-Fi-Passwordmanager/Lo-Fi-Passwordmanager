import {type Item} from "../../Model/Item.ts";
import {useListViewModel} from "../ViewModels/ListViewModel.ts";
import {Entry} from "../../Model/Entry.ts";
import React from "react";
import type {SortCriteria} from "../ViewModels/PasswordViewModel.ts";

/**
 * The View that represents the whole database, which is represented by {@link Entry}/{@link Folder} Class Instances
 * @param item the item which should be depicted, if this is a folder, all of its content is also depicted
 * @param onSetEntry the Method that selects an entry to be shown in the {@link EntryView}
 */
const ListView: React.FC<{
    item: Item,
    setCurItem: (entry: Entry) => void,
    getCurItem: () => Item,
    setItemCreationDialog: () => void,
    setCurrentParent?: (item: Item) => void,
    deleteItem: (item: Item) => void,
    sortCriterion: SortCriteria,
    isAscending: boolean,
    dirtyItemId: string | null,
    openedDbName: string,
    folderToRename: string | null,
    setFolderToRename: (id: string | null) => void,
    changeFolderName: (item: Item, newName: string) => void
}> = ({
          item,
          setCurItem,
          getCurItem,
          setItemCreationDialog,
          setCurrentParent,
          deleteItem,
          sortCriterion,
          isAscending,
          dirtyItemId,
          openedDbName,
          folderToRename,
          setFolderToRename,
          changeFolderName,
      }) => {
    const listViewModel = useListViewModel(item, sortCriterion, isAscending, dirtyItemId, setCurItem);

    function addButtonPressed() {
        setItemCreationDialog();
        setCurrentParent!(item);
    }

    /**
     * If the item to be shown is of type entry, than only its name will be shown
     */
    if (listViewModel.isItemEntry()) {
        const entry = listViewModel.getItem() as Entry;
        return (
            <div className={`listViewEntry ${getCurItem().id === entry.id ? "selected" : ""}`}
                 onClick={() => setCurItem(entry)}>
                <span style={{marginRight: "1ch"}}></span> <span>{entry.title}</span>
                <div className="btnWrapper">
                    <button onClick={() => deleteItem(item)}>🗑️</button>
                </div>
            </div>
        );
        /**
         * If the item is a folder, than all of its children get shown recursivley by creating a {@link ListView} of all of its children.
         * Furthermore a button that extends/collapses the folder and a Button to add a new Element are shown next to the title
         */
    } else if (listViewModel.isItemFolder()) {
        return (
            <>
                {/* Name and Buttons */}
                <div className="listViewTitleHeader">
                    {(item.id != "") &&
                        <button style={{marginRight: "15px", boxShadow: "none"}}
                                onClick={() => listViewModel.toggleExtended()}>{listViewModel.getExtended() ? "▼" : "▷"}</button>}

                    {/* If a folder is being renamed (or just created), an input field is shown instead of the title */}
                    {item.id === folderToRename ?
                        <input
                            type="text"
                            autoFocus
                            onFocus={(e) => e.target.select()}
                            defaultValue={listViewModel.getItem().title}
                            onChange={(e) => listViewModel.setTitle(e.target.value)}
                            onBlur={() => {
                                changeFolderName(item, listViewModel.getItem().title);
                                setFolderToRename(null);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    changeFolderName(item, listViewModel.getItem().title);
                                    setFolderToRename(null);
                                }
                            }}
                            style={{marginLeft: ((item.id != "") ? "" : "10px"), height:"100%", outline:"none", border:"none", margin:"2px"}}
                        />
                            :
                        <span
                            style={{marginLeft: ((item.id != "") ? "" : "10px")}}
                            onDoubleClick={() => setFolderToRename(item.id)}
                        >{(item.id != "") ? listViewModel.getItem().title : openedDbName}
                        </span>
                    }

                    <div className="btnWrapper">
                        <button onClick={() => {
                            addButtonPressed();
                            listViewModel.setExtended(true);
                        }}>+
                        </button>
                        {(item.id != "") && <button onClick={() => deleteItem(item)}>🗑️</button>}
                        {/* FIXME: Löschbestätigung einbauen */}</div>
                </div>

                {/* Recursive call of children with indent to visualizes depth in the tree */}
                <div className="listViewEntryWrapper"
                     style={{display: (listViewModel.getExtended() ? "block" : "none")}}>
                    {listViewModel.getChildren() &&
                        listViewModel.getChildren()!.map((item: Item, index: number) => {
                            return <ListView
                                key={index}
                                item={item}
                                setCurItem={setCurItem}
                                getCurItem={getCurItem}
                                setItemCreationDialog={setItemCreationDialog}
                                setCurrentParent={setCurrentParent}
                                deleteItem={deleteItem}
                                sortCriterion={sortCriterion}
                                isAscending={isAscending}
                                dirtyItemId={dirtyItemId}
                                openedDbName={""}
                                folderToRename={folderToRename}
                                setFolderToRename={setFolderToRename}
                                changeFolderName={changeFolderName}
                            />;
                        })}
                </div>
            </>
        );
    }
};

export default ListView;
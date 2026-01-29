import {type Item} from "../../Model/Item.ts";
import {useListViewModel} from "../ViewModels/ListViewModel.ts";
import {Entry} from "../../Model/Entry.ts";
import React from "react";
import type {SortCriteria} from "../ViewModels/PasswordViewModel.ts";
import FolderMenu from "./MenuViews/FolderMenu.tsx";
import BinIcon from "./Icons/BinIcon.tsx";

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
    selectedFolderId: string | null;
    updateItemTitle: (itemId: string, newTitle: string) => void;
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
          selectedFolderId,
          updateItemTitle
      }) => {
    const listViewModel = useListViewModel(item, sortCriterion, isAscending, dirtyItemId, setCurItem, updateItemTitle);

    function addButtonPressed() {
        setItemCreationDialog();
        setCurrentParent!(item);
    }

    //If the item to be shown is of type entry, than only its name will be shown
    if (listViewModel.isItemEntry()) {
        const entry = listViewModel.getItem() as Entry;
        return (
            <div className={`listViewEntry ${getCurItem().id === entry.id ? "selected" : ""}`}
                 onClick={() => setCurItem(entry)}>
                <span style={{marginRight: "1ch"}}></span> <span>{entry.title}</span>
                <div className={"btnWrapper"}>
                    <button className="listViewEntry button" onClick={() => deleteItem(item)}>
                        <BinIcon/>
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
                <div className={`listViewTitleHeader ${selectedFolderId === item.id ? "flash-highlight" : ""}`}
                     aria-selected={selectedFolderId === item.id}>
                    {/*^^^^^^^^^^ using aria-selected for scrolling to the clicked folder from filtered list view */}
                    {(item.id != "") &&
                        <button style={{marginRight: "15px", boxShadow: "none"}}
                                onClick={() => listViewModel.toggleExtended()}>{listViewModel.getExtended() ? "▼" : "▷"}</button>}

                    {!listViewModel.inEditName &&
                        <span
                            style={{
                                marginLeft: item.id !== "" ? "" : "10px",
                                display: "inline-block", // Required for overflow to work
                                maxWidth: "100%",        // Limits it to the parent's width
                                whiteSpace: "nowrap",    // Prevents text from wrapping to a second line
                                overflow: "hidden",      // Hides the text that goes outside the bounds
                                textOverflow: "ellipsis", // Adds the "..."
                                verticalAlign: "middle"  // Keeps it aligned with buttons
                            }}
                        >{(item.id != "") ? item.title : openedDbName}</span>
                    }
                    {listViewModel.inEditName &&
                        <input type="text"
                               autoFocus
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
                            onAdd={() => addButtonPressed()}
                            onDelete={() => deleteItem(item)}
                            onRename={() => {
                                listViewModel.setAndStoreEditName(true);
                            }}
                        /> : <button className="listViewTitleHeader button" onClick={() => addButtonPressed()}>+</button>}
                    </div>
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
                                dirtyItemId={dirtyItemId} openedDbName={""}
                                updateItemTitle={updateItemTitle}
                                selectedFolderId={selectedFolderId}/>;
                        })}
                </div>
            </>
        );
    }
};

export default ListView;
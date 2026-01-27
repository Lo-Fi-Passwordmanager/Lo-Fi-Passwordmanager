import {type Item} from "../../Model/Item.ts";
import {useListViewModel} from "../ViewModels/ListViewModel.ts";
import {Entry} from "../../Model/Entry.ts";
import React, {useMemo} from "react";
import type {SortCriteria} from "../ViewModels/PasswordViewModel.ts";
import {CSS} from "@dnd-kit/utilities";
import {useDndContext, useDraggable, useDroppable} from "@dnd-kit/core";
import type {Folder} from "../../Model/Folder.ts";

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
      }) => {
    const listViewModel = useListViewModel(item, sortCriterion, isAscending, dirtyItemId, setCurItem);

    function addButtonPressed() {
        setItemCreationDialog();
        setCurrentParent!(item);
    }

    const {active} = useDndContext();


    const getAllDescendantIds = (item: Item): string[] => {
        if (item.isEntry()) {
            return [];
        } else if (!(item as Folder).entries) {
            return [];
        }
        return (item as Folder).entries.flatMap((child) => [child.id, ...getAllDescendantIds(child)]);
    }

    const descendantIds = useMemo(() => {
        return listViewModel.isItemFolder() ? getAllDescendantIds(item) : [];
    }, [item]);


    const isInvalidDropTarget = useMemo(() => {
        if (!active) return false;
        if (active.id === item.id) return true; // Cannot drop onto itself

        const activeDescendants = active.data.current?.descendantIds as string[];
        return activeDescendants.includes(item.id);
    }, [active, item.id]);

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableRef,
        transform,
        isDragging
    } = useDraggable({
        id: item.id,
        data: {type: listViewModel.isItemFolder() ? 'folder' : 'entry',
        descendantIds: descendantIds}
    });

    const {
        setNodeRef: setDroppableRef,
        isOver
    } = useDroppable({
        id: item.id,
        disabled: !listViewModel.isItemFolder() || isInvalidDropTarget
    });

    // Style für das gezogene Element (folgt der Maus)
    const dragStyle = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: (isOver && !isDragging) ? 'rgba(0, 100, 255, 0.1)' : undefined,
        border: (isOver && !isDragging) ? '2px dashed #007bff' : '1px solid transparent',
        cursor: isDragging ? 'grabbing' : (isInvalidDropTarget && isOver ? 'not-allowed' : 'pointer')
    };

    const setFolderRef = (node) => {
        setDraggableRef(node);
        setDroppableRef(node);
    };

    /**
     * If the item to be shown is of type entry, than only its name will be shown
     */
    if (listViewModel.isItemEntry()) {
        const entry = listViewModel.getItem() as Entry;
        return (
            <div className="listViewEntry"
                 onClick={() => setCurItem(entry)}
                 style={dragStyle}
                 ref={setDraggableRef}
                 {...attributes}
                 {...listeners}
            >
                <span style={{marginRight: "1ch"}}></span> <span>{entry.title}</span>
                <div className="btnWrapper">
                    <button onClick={() => deleteItem(item)} onPointerDown={(e) => e.stopPropagation()}>🗑️</button>
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
                <div className="listViewTitleHeader"
                     ref={setFolderRef}
                     style={dragStyle}
                     {...attributes}
                     {...listeners}
                >
                    {(item.id != "") &&
                        <button style={{marginRight: "15px"}}
                                onClick={() => listViewModel.toggleExtended()}
                                onPointerDown={(e) => e.stopPropagation()}
                        >
                            {listViewModel.getExtended() ? ">" : "v"}</button>}

                    <span
                        style={{marginLeft: ((item.id != "") ? "" : "10px")}}>{(item.id != "") ? listViewModel.getItem().title : openedDbName}</span>

                    <div className="btnWrapper">
                        <button onClick={() => {
                            addButtonPressed();
                            listViewModel.setExtended(true);
                        }}
                                onPointerDown={(e) => e.stopPropagation()}>+
                        </button>
                        {(item.id != "") && <button onClick={() => deleteItem(item)}
                                                    onPointerDown={(e) => e.stopPropagation()}>🗑️</button>}
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
                            />;
                        })}
                </div>
            </>
        );
    }
};

export default ListView;
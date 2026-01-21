import {type Item} from "../../Model/Item.ts";
import {useListViewModel} from "../ViewModels/ListViewModel.ts";
import {Entry} from "../../Model/Entry.ts";


/**
 * The View that represents the whole database, which is represented by {@link Entry}/{@link Folder} Class Instances
 * @param item the item which should be depicted, if this is a folder, all of its content is also depicted
 * @param onSetEntry the Method that selects an entry to be shown in the {@link EntryView}
 */
const ListView: React.FC<{
    item: Item,
    setCurItem: (entry: Entry) => void,
    setItemCreationDialog: () => void,
    setCurrentParent?: (item: Item) => void
    deleteItem: (item: Item) => void,
    dirtyItemId: number | null,
}> = ({item, setCurItem, setItemCreationDialog, setCurrentParent, deleteItem, dirtyItemId}) => {
    const listViewModel = useListViewModel(item, dirtyItemId, setCurItem);

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
            <div className="listViewEntry" onClick={() => setCurItem(entry)}>
                <span>Titel:</span> <span>{entry.title}</span>
                <button onClick={() => deleteItem(item)}>🗑️</button>
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
                    <span>{listViewModel.getItem().title}:</span>
                    <button
                        onClick={() => listViewModel.toggleExtended()}>{listViewModel.getExtended() ? ">" : "v"}</button>
                    <button onClick={() => addButtonPressed()}>+</button>
                    {/* Delete button should not be rendered for the root */}
                    {(item.id != "") && <button onClick={() => deleteItem(item)}>🗑️</button>}
                </div>

                {/* Recursive call of children with indent to visualizes depth in the tree */}
                <div className="listViewEntryWrapper"
                     style={{display: (listViewModel.getExtended() ? "block" : "none")}}>
                    {listViewModel.getChildren() &&
                        listViewModel.getChildren()!.map((item: Item, index: number) => {
                            return <ListView key={index} item={item}
                                             setCurItem={setCurItem}
                                             setItemCreationDialog={setItemCreationDialog}
                                             setCurrentParent={setCurrentParent}
                                             deleteItem={deleteItem}
                                             dirtyItemId={dirtyItemId}
                            />;
                        })}
                </div>
            </>
        );
    }
};

export default ListView;
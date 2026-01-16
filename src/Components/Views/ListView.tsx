import type {Item} from "../../Model/Item.ts";
import {useListViewModel} from "../ViewModels/ListViewModel.ts";
import type {Entry} from "../../Model/Entry.ts";

const ListView: React.FC<{
    item: Item,
    onSetEntry: (entry: Entry) => void // This matches the signature of your ViewModel function
}> = ({ item, onSetEntry }) => {
    const listViewModel = useListViewModel(item);

    if (listViewModel.isItemEntry()) {
        let entry = listViewModel.getItem() as Entry;
        return (
            <div className="listViewEntry" onClick={() => onSetEntry(entry)}>
                <span>Titel:</span>        <span>{entry.title}</span>
            </div>
        );
    } else if (listViewModel.isItemFolder()) {
        return (
            <>
                <div className="listViewTitleHeader">
                    <span>{listViewModel.getItem().title}:</span>
                    <button onClick={() => listViewModel.toggleExtended()}>{listViewModel.getExtended()?">":"v"}</button>
                    <button>+</button>
                </div>

                {listViewModel.getExtended() && (
                    <div className="listViewEntryWrapper">
                        {listViewModel.getChildren() &&
                            listViewModel.getChildren()!.map((item: Item, index: number) => {
                                return <ListView key={index} item={item} onSetEntry={onSetEntry} />;
                            })}
                    </div>
                )}
            </>
        );
    }
}

export default ListView;
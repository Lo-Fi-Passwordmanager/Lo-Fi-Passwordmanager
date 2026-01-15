import type {Item} from "../../Model/Item.ts";
import {useListViewModel} from "../ViewModels/ListViewModel.ts";
import type {Entry} from "../../Model/Entry.ts";

const ListView: React.FC<{ item: Item }> = ({item}) => {
    const listViewModel = useListViewModel(item);

    if (listViewModel.isItemEntry()) {
        let entry = listViewModel.getItem() as Entry;
        return (
            <div className="listViewEntry gridContainer">
                <span>Titel:</span>        <span>{entry.title}</span>
                <span>ID:</span>           <span>{entry.id}</span>
                <span>Benutzername:</span> <span>{entry.username}</span>
                <span>URL:</span>          <span>{entry.url}</span>
                <span>Notiz:</span>        <span>{entry.note}</span>
            </div>

        );
    } else if (listViewModel.isItemFolder()) {
        return (
            <>
                <div className="listViewTitleHeader">
                    <span>{listViewModel.getItem().title}:</span>
                    <span><button onClick={() => listViewModel.toggleExtended()}>{listViewModel.getExtended()?">":"v"}</button></span>
                    <span><button>+</button></span>
                </div>

                {listViewModel.getExtended() && (
                    <div className="listViewEntryWrapper">
                        {listViewModel.getChildren() &&
                            listViewModel.getChildren()!.map((item: Item, index: number) => {
                                return <ListView key={index} item={item} />;
                            })}
                    </div>
                )}
            </>
        );
    }
}

export default ListView;
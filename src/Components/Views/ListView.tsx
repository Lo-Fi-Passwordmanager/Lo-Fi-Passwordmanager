import type {Item} from "../../Model/Item.ts";
import {useListViewModel} from "../ViewModels/ListViewModel.ts";
import type {Entry} from "../../Model/Entry.ts";

const ListView: React.FC<{ item: Item }> = ({item}) => {
    const listViewModel = useListViewModel(item);

    if (listViewModel.isItemEntry()) {
        let entry = listViewModel.getItem() as Entry;
        return (
            <div className="listViewEntry">
                <a>Titel: {entry.title}</a>
                <a>ID: {entry.id}</a>
                <a>Benutzername: {entry.username}</a>
                <a>URL: {entry.url}</a>
                <a>Notiz: {entry.note}</a>
            </div>

        );
    } else if (listViewModel.isItemFolder()) {
        return (
            <>
            <div className="listViewContainer">{listViewModel.getItem().title}:</div>
            {listViewModel.getChildren() && listViewModel.getChildren()!.map((item: Item, index: number) => {
                return <ListView key={index} item={item}/>
            })
            }
        </>
    );
    }
}

export default ListView;
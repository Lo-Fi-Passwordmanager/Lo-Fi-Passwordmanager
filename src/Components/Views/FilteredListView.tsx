import React from 'react';
import {Entry} from "../../Model/Entry.ts";
import {Item} from "../../Model/Item.ts";
import type {SortCriteria} from "../ViewModels/PasswordViewModel.ts";
import {useFilteredListViewModel} from "../ViewModels/FilteredListViewModel.ts";
import {Folder} from "../../Model/Folder.ts";

const FilteredListView: React.FC<{
    root: Item,
    setCurItem: (entry: Entry) => void,
    deleteItem: (item: Item) => void,
    sortCriterion: SortCriteria,
    isAscending: boolean,
    filterText: string
}> = ({root, setCurItem, deleteItem, isAscending, sortCriterion, filterText}) => {

    const viewModel = useFilteredListViewModel(root as Folder, filterText, sortCriterion, isAscending);

    const filteredEntries = viewModel.getFilteredEntries();
    const filteredFolders = viewModel.getFilteredFolders();

    return (
        <div className="FilteredListView">
            <div>
                <div className="FilteredListView__header">
                    Gefundene Einträge
                </div>
                {filteredEntries.map((item: Item, index: number) => {
                    return <div className="listViewEntry" key={index} onClick={() => setCurItem(item as Entry)}>
                        <span style={{marginLeft: "5px"}}></span> <span>{item.title}</span>
                        <div className={"btnWrapper"}>
                            <button onClick={() => deleteItem(item)}>🗑️</button>
                        </div>
                    </div>
                })}
            </div>

            <div className={"divider"}/>

            <div>
                <div className="FilteredListView__header">
                    Gefundene Ordner
                </div>
                {filteredFolders.map((item: Item, index: number) => {
                    return <div className="listViewTitleHeader" key={index}>
                        <span style={{marginLeft: "5px"}}></span> <span>{item.title}</span>
                        <div className={"btnWrapper"}>
                            <button onClick={() => deleteItem(item)}>🗑️</button>
                        </div>
                    </div>
                })}
            </div>
        </div>
    );
}
export default FilteredListView;


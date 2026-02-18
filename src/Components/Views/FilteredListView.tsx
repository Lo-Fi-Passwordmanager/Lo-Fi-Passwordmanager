import React from 'react';

import type {Entry} from "../../Model/Entry.ts";
import type {Folder} from "../../Model/Folder.ts";
import type {Item} from "../../Model/Item.ts";
import {useFilteredListViewModel} from "../ViewModels/FilteredListViewModel.ts";

/**
 * The View that represents a filtered list of {@link Entry}/{@link Folder} Class Instances
 *
 * @param root the root folder to start the filtering from
 * @param setCurItem the Method that selects an entry to be shown in the {@link EntryView}
 * @param goToFolder the method to navigate to a specific folder
 * @param deleteItem the method to delete a specific item
 * @param filterText the text to filter the items by
 * @param getSortedChildren function to get sorted children of a folder
 */
const FilteredListView: React.FC<{
    root: Item,
    setCurItem: (entry: Entry) => void,
    goToFolder: (folder: Folder) => void,
    filterText: string
    getSortedChildren: (folder: Folder) => Item[],
}> = ({root, setCurItem, goToFolder, filterText, getSortedChildren}) => {

    const viewModel = useFilteredListViewModel(root as Folder, filterText, getSortedChildren);

    const filteredEntries = viewModel.getFilteredEntries();
    const filteredFolders = viewModel.getFilteredFolders();

    return (
        <div className="FilteredListView">
            <div>
                <div className="FilteredListView__header">
                    Gefundene Einträge
                </div>
                {filteredEntries.map((item: Item, index: number) => {
                    return <div
                        className="listViewEntry"
                        key={index}
                        onClick={() => setCurItem(item as Entry)}
                    >
                        <span style={{marginLeft: "5px"}} /> <span>{item.title}</span>
                    </div>
                })}
            </div>
            <div className={"divider"}/>

            <div>
                <div className="FilteredListView__header">
                    Gefundene Ordner
                </div>
                {filteredFolders.map((item: Item, index: number) => {
                    return <div
                        className="listViewTitleHeader"
                        key={index}
                        onClick={() => goToFolder(item as Folder)}
                    >
                        <span style={{marginLeft: "5px"}} /> <span>{item.title}</span>
                    </div>
                })}
            </div>
        </div>
    );
}
export default FilteredListView;


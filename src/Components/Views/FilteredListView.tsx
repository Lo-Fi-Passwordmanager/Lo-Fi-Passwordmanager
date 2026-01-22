import React from 'react';
import {Entry} from "../../Model/Entry.ts";
import {Item} from "../../Model/Item.ts";
import type {SortCriteria} from "../ViewModels/PasswordViewModel.ts";
import {useFilteredListViewModel} from "../ViewModels/FilteredListViewModel.ts";
import {Folder} from "../../Model/Folder.ts";
import ListView from "./ListView.tsx";

const FilteredListView: React.FC<{
    root: Item,
    setCurItem: (entry: Entry) => void,
    setItemCreationDialog: () => void,
    setCurrentParent?: (item: Item) => void
    deleteItem: (item: Item) => void,
    sortCriterion: SortCriteria,
    isAscending: boolean,
    filterText: string
}> = ({root, setCurItem, setItemCreationDialog, setCurrentParent, deleteItem, sortCriterion, isAscending, filterText}) => {

    const viewModel = useFilteredListViewModel(root as Folder, filterText);

    const filteredEntries = viewModel.getFilteredEntries();
    const filteredFolders = viewModel.getFilteredFolders();

    return (
        <div className="FilderedListView">
            <ListView item={filteredEntries}
                      setCurItem={setCurItem}
                      setItemCreationDialog={setItemCreationDialog}
                      setCurrentParent={setCurrentParent}
                      deleteItem={deleteItem}
                      sortCriterion={sortCriterion}
                      isAscending={isAscending} dirtyItemId={null}
                      getCurItem={() => {console.error("Used Function on Filtered List View which should not be called");
                      return new Folder("Error", "Error")}}
                      openedDbName={""}            />
            <div className={"divider"} style={{width:'100%'}}/>
            <div>
                {filteredFolders.entries.map((item: Item, index: number) => {
                return <div className="listViewTitleHeader" key={index}>
                    <span style={{marginLeft: "5px"}}>Titel:</span> <span>{item.title}</span>
                    <button onClick={() => deleteItem(item)}>🗑️</button>
                </div>
            })}
            </div>
        </div>
    );
}
export default FilteredListView;


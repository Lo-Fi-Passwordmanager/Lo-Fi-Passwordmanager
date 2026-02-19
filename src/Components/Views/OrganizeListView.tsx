import React from 'react';
import {HiMiniPlus} from "react-icons/hi2";

import type {SortCriteria} from "../ViewModels/PasswordViewModel.ts";

/**
 * The View that contains the search bar, sorting options and buttons to close the database and add new items
 *
 * @param curSortCriterion the current sort criterion
 * @param setCurSortCriterion method to set the current sort criterion
 * @param toggleOrder method to toggle between ascending and descending order
 * @param isAscending whether the sorting is ascending or descending
 * @param setLiveSearchValue method to set the current typed search value
 * @param liveSearchValue the current typed search value
 * @param closeDatabase method to close the currently opened database
 * @param setItemCreationDialog method to open a dialog to create a new item
 * @param inEditable whether the view is currently in editable mode to disable certain actions
 */
const OrganizeListView: React.FC<{
    curSortCriterion: SortCriteria;
    setCurSortCriterion: (criterion: SortCriteria) => void,
    toggleOrder: () => void,
    isAscending: boolean,
    setLiveSearchValue: (value: string) => void,
    liveSearchValue: string,
    closeDatabase: () => void,
    setItemCreationDialog: () => void,
    inEditable: boolean
}> = ({
          curSortCriterion,
          setCurSortCriterion,
          toggleOrder,
          isAscending,
          setLiveSearchValue,
          liveSearchValue,
          closeDatabase,
          setItemCreationDialog,
          inEditable
      }) => {

    return (
        <div className={"organizeListView"}>
            {/*Container for every related to the search/Sort features plus log out button*/}
            <div className={"OrganizedListView"}>
                {/*Giving each element a specific grid column to align them properly*/}

                {/* Button to close the database and go back to the database selection */}
                <button className={"squareButton"} title="Datenbank schließen" style={{gridColumn: "span 1", justifySelf: "flex-start"}}
                        onClick={() => closeDatabase()}>
                    ⬅
                </button>

                <input style={{gridColumn: "span 8"}} type="text" placeholder="Suchen..." value={liveSearchValue}
                       onChange={(event => setLiveSearchValue(event.target.value))}/>
                {/* Search bar to filter the list of entries and folders */}
                <button
                    className={"squareButton"}
                    disabled={inEditable}
                    style={{gridColumn: "span 1"}}
                    onClick={() => {
                        setItemCreationDialog();
                    }}
                    title="Eintrag ins Startverzeichnis hinzufügen"
                >
                    <HiMiniPlus size={24}/>
                </button>

                <select style={{gridColumn: "span 9", width: "100%"}} value={curSortCriterion}
                        onChange={(e) => setCurSortCriterion(e.target.value as SortCriteria)}>
                    <option value="NAME">Alphabetisch</option>
                    <option value="CREATED">Erstellungsdatum</option>
                    <option value="EDITED">Bearbeitungsdatum</option>
                </select>

                <button
                    className={"squareButton"}
                    style={{gridColumn: "span 1"}} onClick={() => {
                    toggleOrder()
                }}
                title={isAscending ? "Absteigend sortieren" : "Aufsteigend sortieren"}>
                    {isAscending ? '🡅' : '🡇'}
                </button>
            </div>
        </div>
    );
}
export default OrganizeListView;
import React from 'react';
import type {SortCriteria} from "../ViewModels/PasswordViewModel.ts";

const OrganizeListView: React.FC<{
    getCurSortCriterion: () => SortCriteria,
    setCurSortCriterion: (criterion: SortCriteria) => void,
    toggleOrder: () => void,
    isAscending: boolean,
    setLiveSearchValue: (value: string) => void,
    liveSearchValue: string,
    closeDatabase: () => void,
    setItemCreationDialog: () => void,
}> = ({
          getCurSortCriterion,
          setCurSortCriterion,
          toggleOrder,
          isAscending, setLiveSearchValue, liveSearchValue, closeDatabase,
          setItemCreationDialog
      }) => {

    return (
        <div className={"borderBox"} style={{borderLeft: "0", borderTop: "0"}}>
            {/*Container for every related to the search/Sort features plus log out button*/}
            <div className={"OrganizedListView"}>
                {/*Giving each element a specific grid column to align them properly*/}

                {/* Button to close the database and go back to the database selection */}
                <button style={{gridColumn: "span 1"}} onClick={() => closeDatabase()}>⬅</button>

                <input style={{gridColumn: "span 8"}} type="text" placeholder="Suchen..." value={liveSearchValue}
                       onChange={(event => setLiveSearchValue(event.target.value))}/>
                {/* Search bar to filter the list of entries and folders */}
                <button style={{gridColumn: "span 1", fontSize: "1.2em"}} onClick={() => {
                    setItemCreationDialog();
                }}>+
                </button>

                <select style={{gridColumn: "span 9"}} value={getCurSortCriterion()}
                        onChange={(e) => setCurSortCriterion(e.target.value as SortCriteria)}>
                    <option value="NAME">Alphabetisch</option>
                    <option value="CREATED">Erstellungsdatum</option>
                    <option value="EDITED">Bearbeitungsdatum</option>
                </select>

                <button style={{gridColumn: "span 1"}} onClick={() => {
                    toggleOrder()
                }}>
                    {isAscending ? '🡅' : '🡇'}
                </button>
            </div>
        </div>
    );
}
export default OrganizeListView;
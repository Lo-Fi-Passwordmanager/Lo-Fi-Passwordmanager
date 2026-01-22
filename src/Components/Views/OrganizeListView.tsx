import React from 'react';
import type {SortCriteria} from "../ViewModels/PasswordViewModel.ts";

const OrganizeListView: React.FC<{
    getCurSortCriterion: () => SortCriteria,
    setCurSortCriterion: (criterion: SortCriteria) => void
    toggleOrder: () => void
    getOrder: boolean
    setLiveSearchValue: (value: string) => void
}> = ({getCurSortCriterion, setCurSortCriterion, toggleOrder, getOrder: isAscending, setLiveSearchValue}) => {

    return (
        <div className={"borderBox"} style={{borderLeft: "0", borderTop: "0"}}>
            <div className={"SearchContainer"}>
                <input className="search-bar" type="text" placeholder="Suchen..."
                onChange={(event => setLiveSearchValue(event.target.value))}/>
            </div>
            <div className="SortContainer">
                <select className="sort-menu"
                        value={getCurSortCriterion()}
                        onChange={(e) => setCurSortCriterion(e.target.value as SortCriteria)}>
                    <option value="NAME">Alphabetisch</option>
                    <option value="CREATED">Erstellungsdatum</option>
                    <option value="EDITED">Bearbeitungsdatum</option>
                </select>
                <button onClick={() => {
                    toggleOrder()
                }}>
                    {isAscending ? '🡇' : '🡅'}
                </button>
            </div>
        </div>
    );
}
export default OrganizeListView;
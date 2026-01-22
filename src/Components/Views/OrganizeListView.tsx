import React from 'react';
import type {SortCriteria} from "../ViewModels/PasswordViewModel.ts";

const OrganizeListView: React.FC<{
    getCurSortCriterion: () => SortCriteria,
    setCurSortCriterion: (criterion: SortCriteria) => void
    toggleOrder: () => void
    getOrder: boolean
}> = ({getCurSortCriterion, setCurSortCriterion, toggleOrder, getOrder: isAscending}) => {

    return (
        <div className="borderBox" style={{borderLeft: "0", borderTop: "0"}}>
            <select className="sort-menu"
            value={getCurSortCriterion()}
            onChange={(e) => setCurSortCriterion(e.target.value as SortCriteria)}>
                <option value="NAME">Alphabetisch</option>
                <option value="CREATED">Erstellungsdatum</option>
                <option value="EDITED">Bearbeitungsdatum</option>
            </select>
            <button onClick={() => {toggleOrder()}}>
                {isAscending ? '⬆️' : '⬇️'}
            </button>

        </div>
    );
}
export default OrganizeListView;
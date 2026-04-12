import React from 'react';
import {useTranslation} from "react-i18next";
import {HiBarsArrowDown, HiBarsArrowUp, HiLockClosed} from "react-icons/hi2";

import {loadCurrentSortCriterion} from "../../Utility/Storage.ts";
import {SortCriteria} from "../ViewModels/PasswordViewModel.ts";
import IndividualSortingToggleButton from "./ButtonViews/IndividualSortingToggleButton.tsx";

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
 * @param isIndividualSorting boolean if sorting is enabled
 * @param toggleIndividualSorting method to toggle sorting boolean
 */
const OrganizeListView: React.FC<{
    curSortCriterion: SortCriteria;
    setCurSortCriterion: (criterion: SortCriteria) => void,
    toggleOrder: () => void,
    isAscending: boolean,
    setLiveSearchValue: (value: string) => void,
    liveSearchValue: string,
    closeDatabase: () => void,
    isIndividualSorting: boolean,
    toggleIndividualSorting: () => void,
}> = ({
          curSortCriterion,
          setCurSortCriterion,
          toggleOrder,
          isAscending,
          setLiveSearchValue,
          liveSearchValue,
          closeDatabase,
    isIndividualSorting,
toggleIndividualSorting
}) => {
    const {t} = useTranslation();

    return (
        <div className={"organizeListView"}>
            {/*Container for every related to the search/Sort features plus log out button*/}
            {/*Giving each element a specific grid column to align them properly*/}

            {/* Button to close the database and go back to the database selection */}
            <button className={"squareButton"} title="Datenbank schließen"
                    style={{gridColumn: "span 1", justifySelf: "flex-start"}}
                    onClick={() => closeDatabase()}>
                <HiLockClosed size={18}/>
            </button>

            <input style={{gridColumn: "span 2", height: "2.5rem", minWidth: "100%"}}
                   type="text" placeholder={t("filtered_list.placeholder_search")}
                   value={liveSearchValue}
                   onChange={(event => setLiveSearchValue(event.target.value))}
                   title={"Nach Einträgen und Ordnern suchen"}/>
            {/* Search bar to filter the list of entries and folders */}
            {/*<button
                    className={"squareButton"}
                    disabled={inEditable}
                    style={{gridColumn: "span 1"}}
                    onClick={() => {
                        setItemCreationDialog();
                    }}
                    title="Eintrag ins zuletzt geöffnete Verzeichnis hinzufügen"
                >
                    <HiMiniPlus size={24}/>
                </button> */}

            <select style={{gridColumn: "span 2", width: "100%"}} value={curSortCriterion}
                    onChange={(e) => setCurSortCriterion(e.target.value as SortCriteria)}
                    title={"Einträge und Ordner sortieren"}>
                <option value="NAME">{t("filtered_list.alphabetical")}</option>
                <option value="CREATED">{t("filtered_list.creation")}</option>
                <option value="EDITED">{t("filtered_list.edited")}</option>
                <option value="RELEVANCE">{t("filtered_list.relevance")}</option>
                <option value="RECENTLY">{t("filtered_list.recently")}</option>
                <option value="INDIVIDUAL">{t("filtered_list.individual")}</option>
            </select>

            {loadCurrentSortCriterion() !== SortCriteria.Individual ? <button
                className={"squareButton"}
                style={{gridColumn: "span 1", justifySelf: "flex-end"}} onClick={() => {
                toggleOrder()
            }}
                title={isAscending ? "Absteigend sortieren" : "Aufsteigend sortieren"}>
                {isAscending ? <HiBarsArrowDown size={24}/> : <HiBarsArrowUp size={24}/>}
            </button> : <IndividualSortingToggleButton sorting={isIndividualSorting} toggleSorting={toggleIndividualSorting}/>}
        </div>
    );
}
export default OrganizeListView;
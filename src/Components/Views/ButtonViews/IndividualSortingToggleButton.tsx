import React from "react";
import {HiMiniArrowsPointingIn, HiMiniArrowsPointingOut} from "react-icons/hi2";

/**
 * A button that toggles if you sort or move items while individual sorting is selected
 * @param sorting boolean if sorting is enabled
 * @param toggleSorting function that toggles the boolean
 */
const IndividualSortingToggleButton: React.FC<{
    sorting: boolean,
    toggleSorting: () => void,
}> = ({sorting, toggleSorting}) => {

    if (!sorting) {
        return (
            <button className={"squareButton"}
                    onClick={() => toggleSorting()}
                    title={"Individuelle Sortierung anpassen"}
            >
                <HiMiniArrowsPointingOut size={24}/>
            </button>
        );
    } else {
        return (
            <button className={"squareButton"}
                    onClick={() => toggleSorting()}
                    title={"Einträge und Ordner verschieben"}
            >
                <HiMiniArrowsPointingIn size={24}/>
            </button>
        );
    }
}
export default IndividualSortingToggleButton;
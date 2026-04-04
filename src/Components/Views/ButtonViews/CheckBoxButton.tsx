import React from "react";
import {HiMiniArrowsPointingIn, HiMiniArrowsPointingOut} from "react-icons/hi2";

/**
 * A button that is a checkbox for the individual sorting
 */
const CheckBoxButton: React.FC<{
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
export default CheckBoxButton;
import React from "react";
import {HiMiniArrowsPointingIn, HiMiniArrowsPointingOut} from "react-icons/hi2";
import {useTranslation} from "react-i18next";

/**
 * A button that toggles if you sort or move items while individual sorting is selected
 * @param sorting boolean if sorting is enabled
 * @param toggleSorting function that toggles the boolean
 */
const IndividualSortingToggleButton: React.FC<{
    sorting: boolean,
    toggleSorting: () => void,
}> = ({sorting, toggleSorting}) => {
    const {t} = useTranslation();

    if (!sorting) {
        return (
            <button className={"squareButton"}
                    onClick={() => toggleSorting()}
                    title={t("sorting_individual_change")}
            >
                <HiMiniArrowsPointingOut size={24}/>
            </button>
        );
    } else {
        return (
            <button className={"squareButton"}
                    onClick={() => toggleSorting()}
                    title={t("sorting_individual_regroup")}
            >
                <HiMiniArrowsPointingIn size={24}/>
            </button>
        );
    }
}
export default IndividualSortingToggleButton;
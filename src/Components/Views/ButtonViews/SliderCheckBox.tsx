import React from "react";

/**
 * A checkbox that looks like a slider and can be toggled on and off.
 *
 * @param checked whether the checkbox is currently checked or not
 * @param toggleChecked function to toggle the checked state of the checkbox
 */
const SliderCheckBox: React.FC<{
    checked: boolean;
    toggleChecked: () => void;
}> = ({checked, toggleChecked}) => {

    return (
        <label className="switch">
            <input type="checkbox" checked={checked}
                   onChange={toggleChecked}/>
            <span className="slider round"/>
        </label>
    )
}
export default SliderCheckBox;
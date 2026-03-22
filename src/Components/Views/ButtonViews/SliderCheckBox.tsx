import React from "react";

/**
 * A checkbox that looks like a slider and can be toggled on and off.
 *
 * @param checked whether the checkbox is currently checked or not
 * @param toggleChecked function to toggle the checked state of the checkbox
 */
const SliderCheckBox: React.FC<{
    checked: boolean;
    disabled?: boolean;
    toggleChecked: () => void;
    style?: React.CSSProperties;
}> = ({checked, disabled, toggleChecked, ...style}) => {

    return (
        <label className={`switch ${disabled ? "disabled" : ""}`} {...style}>
            <input type="checkbox" checked={checked} disabled={disabled ?? false}
                   onChange={toggleChecked}/>
            <span className="slider round"/>
        </label>
    );
};
export default SliderCheckBox;
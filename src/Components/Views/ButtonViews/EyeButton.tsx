import React from "react";
import EyeIcon from "../Icons/EyeIcon.tsx";

/**
 * A button that toggles the visibility of a password
 * @param hidePassword whether the password is currently hidden
 * @param toggleHidePassword function to toggle the hidePassword state
 */
const EyeButton: React.FC<{
    hidePassword: boolean;
    toggleHidePassword: () => void;
}> = ({hidePassword, toggleHidePassword}) => {

    return (
        <button className={`eyeButton ${hidePassword ? "" : "selected"}`}
                onClick={() => toggleHidePassword()}>
            <EyeIcon enabled={!hidePassword}/>
        </button>
    );
}
export default EyeButton;
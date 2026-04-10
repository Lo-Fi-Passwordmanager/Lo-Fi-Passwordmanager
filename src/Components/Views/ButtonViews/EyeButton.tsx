import React from "react";
import {HiEye} from "react-icons/hi";
import {HiEyeSlash} from "react-icons/hi2";
import {useTranslation} from "react-i18next";

/**
 * A button that toggles the visibility of a password
 * @param hidePassword whether the password is currently hidden
 * @param toggleHidePassword function to toggle the hidePassword state
 */
const EyeButton: React.FC<{
    hidePassword: boolean;
    toggleHidePassword: () => void;
    size?: number;
}> = ({hidePassword, toggleHidePassword, size}) => {

    const { t } = useTranslation();
    if (!hidePassword) {
        return (
            <button className={`eyeButton ${hidePassword ? "" : "selected"}`}
                    onClick={() => toggleHidePassword()}
                    style={size ? {height: size, width: size} : {}}
                    title={t("button.hide_password")}
            >
                <HiEye size={24}/>
            </button>
        );
    } else {
        return (
            <button className={`eyeButton ${hidePassword ? "" : "selected"}`}
                    onClick={() => toggleHidePassword()}
                    style={size ? {height: size, width: size} : {}}
                    title={t("button.show_password")}
            >
                <HiEyeSlash size={24}/>
            </button>
        );
    }
}
export default EyeButton;
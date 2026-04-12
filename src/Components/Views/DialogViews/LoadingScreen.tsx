import React from "react";
import {useTranslation} from "react-i18next";

import LoadingSpinner from "../Icons/LoadingSpinner.tsx";

const LoadingScreen: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="loadingOverlay">
            <LoadingSpinner/>
            <p className="loadingText">{t("loading.title")} </p>
        </div>
    );
};
export default LoadingScreen;
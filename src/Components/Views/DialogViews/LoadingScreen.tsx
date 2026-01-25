import React from "react";
import LoadingSpinner from "../Icons/LoadingSpinner.tsx";

const LoadingScreen: React.FC = () => {
    return (
        <div className="loadingOverlay">
            <LoadingSpinner/>
            <p className="loadingText">Loading </p>
        </div>
    );
};
export default LoadingScreen;
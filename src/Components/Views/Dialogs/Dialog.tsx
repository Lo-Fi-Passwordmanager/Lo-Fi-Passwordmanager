import React, {type PropsWithChildren} from "react";

/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const Dialog: React.FC<PropsWithChildren & { title: string, onCloseDialog: () => void }> = ({
    children,
    title,
    onCloseDialog
}) => {
    return (
        <div className="settingsBackground dialogOverlay" onClick={onCloseDialog}>
            <div className="dialog">
                <h1 style={{fontSize: "2em", marginBottom: "20px"}}>{title}</h1>
                {children}
            </div>
        </div>
    );
};

export default Dialog;
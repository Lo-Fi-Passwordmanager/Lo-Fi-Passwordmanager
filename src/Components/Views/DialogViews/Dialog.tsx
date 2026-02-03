import React, {type HTMLAttributes, type PropsWithChildren} from "react";
import Close from "../Icons/Close.tsx";

/**
 * The view that links to the {@link Settings} singleton and toggles its values.
 */
const Dialog: React.FC<PropsWithChildren & HTMLAttributes<HTMLDivElement> & {
    title: string,
    onCloseDialog: () => void
}> = ({
    children,
    title,
    onCloseDialog,
    className,
    ...props
}) => {
    return (
        <div className={`settingsBackground dialogOverlay`}>
            <div className={`dialog ${className ? className : ""}`} {...props}>
                <Close className="closeIcon" color={"var(--text)"} onClick={onCloseDialog}/>
                <h1 style={{fontSize: "1.5em", marginBottom: "20px"}}>{title}</h1>
                {children}
            </div>
        </div>
    );
};

export default Dialog;
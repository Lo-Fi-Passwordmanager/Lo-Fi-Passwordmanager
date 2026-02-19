import React, {type HTMLAttributes, type PropsWithChildren, useEffect} from "react";

import Close from "../Icons/Close.tsx";

/**
 * A generic dialog component that can be used to show any content in a dialog overlay.
 *
 * @param title The title of the dialog.
 * @param onCloseDialog The function to call when the dialog should be closed.
 * @param children The content to display inside the dialog.
 * @param className Optional additional class names for the dialog container.
 * @param props Additional HTML attributes for the dialog container.
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

    useEffect(() => {
        const close = (e: { keyCode: number; }) => {
            if(e.keyCode === 27){
                onCloseDialog();
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    },[onCloseDialog])


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
import React, { useEffect } from "react";

type ToastProps = {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
};

const ToastDialog: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    if (!isVisible) return null;

    return <div className="floatingToast">{message}</div>;
};

export default ToastDialog;
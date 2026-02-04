import React, { useEffect } from "react";

/**
 * A toast dialog that shows a brief message and disappears after a set duration.
 *
 * @param message The message to display in the toast.
 * @param isVisible Whether the toast is currently visible.
 * @param onClose Function to call when the toast should be closed.
 * @param duration Duration in milliseconds before the toast disappears (default is 3000ms).
 */
const ToastDialog: React.FC<{
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}> = ({ message, isVisible, onClose, duration = 3000 }) => {
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
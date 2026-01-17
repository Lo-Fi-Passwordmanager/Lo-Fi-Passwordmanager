import React, {useState} from "react";

interface ToastProps {
    timeInMS: number;
    message: string;
}

const FloatingToast: React.FC<ToastProps> = ({
                                                                timeInMS,
                                                                message,
                                                            }) => {
    const [className, setClassName] = useState("floatingToast")

    const time = timeInMS;

    function showToast() {
        setClassName("floatingToast.show");
        setTimeout(hideToast, time);
    }

    function hideToast() {
        setClassName("floatingToast.hide");
    }

    return (
        <div className={className}>{message}</div>
    )


}
export default FloatingToast;
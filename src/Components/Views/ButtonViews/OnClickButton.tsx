import React, {useState} from "react";
import {baseStyle, hoverStyle} from "../CSS.ts";

interface OnClickButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    style?: React.CSSProperties;
}

const OnClickButton: React.FC<OnClickButtonProps> = ({style, children, ...props}) => {
    const [isHovered, setIsHovered] = useState(false);

    const combinedStyle: React.CSSProperties = {
        ...baseStyle,
        ...(isHovered ? hoverStyle : {}),
        ...style,
    };

    return (
        <button
            style={combinedStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {children}
        </button>
    );
}
export default OnClickButton;
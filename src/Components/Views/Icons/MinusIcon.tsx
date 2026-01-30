const MinusIcon = () => {

    const commonProps = {
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
    };

    return (
        <svg {...commonProps}>
            <path d="M6 12L18 12"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    );
};

export default MinusIcon;
import React, {type HTMLAttributes} from "react";

const LogoOutlines: React.FC<{ color?: string } & HTMLAttributes<HTMLDivElement>> = ({color, ...props}) => {
    return (
        <div {...props}>
            <svg
                viewBox="0 0 986.42 986.42"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
                version="1.1"
                id="svg1"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    style={{
                        fill: "none",
                        stroke: color ? color : "black",
                        strokeWidth: 2,
                        strokeLinecap: "round",
                        strokeOpacity: 1,
                        vectorEffect: "non-scaling-stroke"
                    }}
                    d="M574.57,45.77l366.08,366.08c44.93,44.93,44.93,117.78,0,162.71l-366.08,366.08c-44.93,44.93-117.78,44.93-162.71,0h0L45.77,574.57c-44.93-44.93-44.93-117.78,0-162.71L411.86,45.77c44.93-44.93,117.78-44.93,162.71,0h0Z"
                />
            </svg>
        </div>
    );
};

export default LogoOutlines;

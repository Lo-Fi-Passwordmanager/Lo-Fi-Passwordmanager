import React, {type HTMLAttributes} from "react";

const Close: React.FC<{ color?: string } & HTMLAttributes<HTMLDivElement>> = ({color, ...props}) => {
    return (
        <div {...props}>
            <svg
                viewBox="0 0 8.4666662 8.4666666"
                version="1.1"
                id="svg1"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    style={{
                        fill: "none",
                        stroke: color ? color : "black",
                        strokeWidth: 1.0583333,
                        strokeLinecap: "round",
                        strokeOpacity: 1
                    }}
                    d="M 7.9374997,7.9374997 0.52916665,0.52916665"
                    id="path3"/>
                <path
                    style={{
                        fill: "none",
                        stroke: color ? color : "black",
                        strokeWidth: 1.0583333,
                        strokeLinecap: "round",
                        strokeOpacity: 1
                    }}
                    d="M 0.52916665,7.9374997 7.9374997,0.52916665"
                    id="path4"/>
            </svg>
        </div>
    );
};

export default Close;

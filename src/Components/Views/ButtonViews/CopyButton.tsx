import React, {type CSSProperties, useState} from "react";
import {HiMiniClipboardDocumentCheck, HiMiniClipboardDocumentList} from "react-icons/hi2";

/**
 * A button that copies a given text to the clipboard and shows a checkmark for a short time after being clicked
 * @param copyAndClearClipboard function to copy a string to the clipboard and clear it afterwards
 * @param attributeValue the string that should be copied to the clipboard when the button is clicked
 */
const CopyButton: React.FC<{
    copyAndClearClipboard: (text: string, timeout?: number) => void,
    attributeValue: string;
    style?: CSSProperties;
}> = ({copyAndClearClipboard, attributeValue, style}) => {

    const [clicked, setClicked] = useState(false);

    if (!clicked) {
        return (
            <button className={"copyButton"} onClick={() => {
                setClicked(true);
                setTimeout(() => setClicked(false), 2000);
                void copyAndClearClipboard(attributeValue);
            }}
                    title={"In Zwischenablage kopieren"}
                    style={style}
            >
                <HiMiniClipboardDocumentList size={24}/>
            </button>
        );
    } else {
        return (
            <button className={"copyButton selected"} disabled style={style}>
                <HiMiniClipboardDocumentCheck size={24}/>
            </button>
        );
    }
};
export default CopyButton;
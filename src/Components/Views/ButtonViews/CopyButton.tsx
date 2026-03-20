import React, {type CSSProperties, useState} from "react";
import {HiMiniClipboardDocumentCheck, HiMiniClipboardDocumentList} from "react-icons/hi2";

/**
 * A button that copies a given text to the clipboard and shows a checkmark for a short time after being clicked
 * @param copyToClipboard function to copy a string to the clipboard and clear it afterwards, if timeout given
 * @param attributeValue the string that should be copied to the clipboard when the button is clicked
 */
const CopyButton: React.FC<{
    copyToClipboard: (text: string, timeout?: number) => void,
    attributeValue: string;
    style?: CSSProperties;
    title?: string;
    content?: string;
}> = ({copyToClipboard, attributeValue, style, title, content}) => {

    const [clicked, setClicked] = useState(false);

    if (!clicked) {
        return (
            <button className={"copyButton"} onClick={() => {
                setClicked(true);
                setTimeout(() => setClicked(false), 2000);
                void copyToClipboard(attributeValue)
            }}
                    title={title ? title : "In Zwischenablage kopieren"}
                    style={style}
            >
                {content ? <><HiMiniClipboardDocumentList size={24}/>&nbsp;{content} </> : <HiMiniClipboardDocumentList size={24}/>}
            </button>
        );
    } else {
        return (
            <button className={"copyButton selected"} disabled style={style}>
                {content ? <><HiMiniClipboardDocumentCheck size={24}/>&nbsp;{content} </> :
                    <HiMiniClipboardDocumentCheck size={24}/>}
            </button>
        );
    }
};
export default CopyButton;
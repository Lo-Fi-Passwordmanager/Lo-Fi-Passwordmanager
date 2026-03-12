import React, {useState} from "react";
import {HiMiniClipboardDocumentList, HiMiniClipboardDocumentCheck} from "react-icons/hi2";

/**
 * A button that copies a given text to the clipboard and shows a checkmark for a short time after being clicked
 * @param copyAndClearClipboard function to copy a string to the clipboard and clear it afterwards
 * @param attributeValue the string that should be copied to the clipboard when the button is clicked
 */
const CopyButton: React.FC<{
    copyAndClearClipboard: (text: string, timeout?: number) => void,
    attributeValue: string;
}> = ({copyAndClearClipboard, attributeValue}) => {

    const [clicked, setClicked] = useState(false);

    if (!clicked) {
        return (
            <button className={"copyButton"} onClick={() => {
                setClicked(true)
                setTimeout(() => setClicked(false), 2000);
                copyAndClearClipboard(attributeValue)
            }}
                    title={"In Zwischenablage kopieren"}
            >
                <HiMiniClipboardDocumentList size={24}/>
            </button>
        );
    } else {
        return (
            <button className={"copyButton selected"} disabled>
                <HiMiniClipboardDocumentCheck size={24}/>
            </button>
        );
    }
}
export default CopyButton;
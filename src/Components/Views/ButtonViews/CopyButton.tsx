import React, {type CSSProperties, useState} from "react";
import {useTranslation} from "react-i18next";
import {HiMiniClipboardDocumentCheck, HiMiniClipboardDocumentList} from "react-icons/hi2";

import {addRelevance} from "../../../Utility/Storage.ts";

/**
 * A button that copies a given text to the clipboard and shows a checkmark for a short time after being clicked
 * @param copyToClipboard function to copy a string to the clipboard and clear it afterwards, if timeout given
 * @param attributeValue the string that should be copied to the clipboard when the button is clicked
 * @param style optional style options
 * @param title optional title
 * @param content optional extra content to be shown next to the button, e.g. "Copy Password"
 * @param id optional item id for tracking relevance
 */
const CopyButton: React.FC<{
    copyToClipboard: (text: string, timeout?: number) => void,
    attributeValue: string;
    style?: CSSProperties;
    title?: string;
    content?: string;
    id?: string;
}> = ({copyToClipboard, attributeValue, style, title, content, id}) => {

    const [clicked, setClicked] = useState(false);
    const { t } = useTranslation();

    if (!clicked) {
        return (
            <button className={"copyButton"} onClick={() => {
                setClicked(true);
                setTimeout(() => setClicked(false), 2000);
                void copyToClipboard(attributeValue)
                if (id) addRelevance(id);
            }}
                    title={title ? title : t("toast_clipboard_copy")}
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
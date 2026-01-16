import type {Entry} from "../../Model/Entry.ts";
import {useState} from "react";


export const usePasswortViewModel = (entry:Entry) => {

    const [curEntry, setCurEntry] = useState(entry);

    function getCurEntry() {
        return curEntry;
    }

    return {
        setCurEntry,
        getCurEntry,
    };
};
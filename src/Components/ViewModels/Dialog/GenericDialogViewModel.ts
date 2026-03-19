import {useState} from "react";

/**
 * The Viewmodel for any Dialog that just needs an open and closed state
 */
export const useGenericDialogViewModel = () => {

    const [isOpen, setIsOpen] = useState(false);

    return {
        isOpen,
        setIsOpen
    };
};
import React, {useState} from "react";

/**
 * The view model for the FolderMenu component.
 */
export const useFolderMenuViewModel = () => {
    const [isOpen, setIsOpen] = useState(false);

    // prevent click from dragging item
    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return {
        isOpen,
        toggleMenu,
        setIsOpen,
    };
}
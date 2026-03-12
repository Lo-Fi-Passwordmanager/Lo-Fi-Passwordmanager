import React, {useState, useEffect, useRef} from "react";
import {HiPencil, HiTrash} from "react-icons/hi";
import {HiMiniPlus} from "react-icons/hi2";

/**
 * A 3-dot menu for folders which contains buttons to create an item, edit the title and delete the folder
 *
 * @param onDelete method to delete the folder
 * @param onRename method to rename the folder
 * @param onAdd method to add a new item to the folder
 * @param disabled whether the menu is disabled
 */
const FolderMenu: React.FC<{
    onDelete: () => void;
    onRename: () => void;
    onAdd: () => void;
    disabled: boolean;
}> = ({onDelete, onRename, onAdd, disabled}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // prevent click from dragging item
    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className="action-menu-wrapper" ref={menuRef} onClick={(e) => e.stopPropagation()}>

            <div className={`action-items ${isOpen ? "open" : ""}`}>
                <button
                    className="listViewTitleHeader menu button"
                    disabled={!isOpen}
                    title="Eintrag hinzufügen"
                    onClick={() => {
                        onAdd();
                        setIsOpen(false);
                    }}>
                    <HiMiniPlus size={24}/>
                </button>
                <button
                    disabled={!isOpen}
                    className="listViewTitleHeader menu button"
                    title="Ordner umbennen"
                    onClick={() => {
                        onRename();
                        setIsOpen(false);
                    }}>
                    <HiPencil size={24}/>
                </button>
                <button
                    className="listViewTitleHeader menu button"
                    title="Ordner löschen"
                    disabled={!isOpen}
                    onClick={onDelete}>
                    <HiTrash size={24}/>
                </button>
            </div>

            <button
                className={`listViewTitleHeader button ${isOpen ? "active" : ""}`}
                onClick={toggleMenu}
                disabled={disabled}
                title={isOpen ? "Menü schließen" : "Menü öffnen"}
            >
                ⋮
            </button>
        </div>
    );
};

export default FolderMenu;
import React, {useState, useEffect, useRef} from "react";
import {HiMiniPlus} from "react-icons/hi2";
import {HiPencil, HiTrash} from "react-icons/hi";

interface Props {
    onDelete: () => void;
    onRename: () => void;
    onAdd: () => void;
    disabled: boolean;
}

const FolderMenu: React.FC<Props> = ({onDelete, onRename, onAdd, disabled}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = () => {
            if (menuRef.current && !menuRef.current.contains(document.activeElement)) {
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
                <button className="listViewTitleHeader button" onClick={() => {
                    onAdd();
                    setIsOpen(false);
                }}>
                    <HiMiniPlus size={24}/>
                </button>
                <button className="listViewTitleHeader button" onClick={() => {
                    onRename();
                    setIsOpen(false);
                }}>
                    <HiPencil size={24}/>
                </button>
                <button className="listViewTitleHeader button" onClick={onDelete}>
                    <HiTrash size={24}/>
                </button>
            </div>

            <button
                className={`listViewTitleHeader button ${isOpen ? "active" : ""}`}
                onClick={toggleMenu}
                disabled={disabled}
            >
                ⋮
            </button>
        </div>
    );
};

export default FolderMenu;

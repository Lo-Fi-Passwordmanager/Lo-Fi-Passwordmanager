import React, {useState, useEffect, useRef} from "react";

interface Props {
    onDelete: () => void;
    onRename: () => void;
    onAdd: () => void;
}

const FolderMenu: React.FC<Props> = ({onDelete, onRename, onAdd}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = () => {
            if (menuRef.current) {
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
                <button className="listViewTitleHeader button" onClick={onAdd}>
                    +
                </button>
                <button className="listViewTitleHeader button" onClick={onRename}>
                    ✏️
                </button>
                <button className="listViewTitleHeader button" onClick={onDelete}>
                    🗑️
                </button>
            </div>

            <button
                className={`listViewTitleHeader button ${isOpen ? "active" : ""}`}
                onClick={toggleMenu}
            >
                ⋮
            </button>
        </div>
    );
};

export default FolderMenu;

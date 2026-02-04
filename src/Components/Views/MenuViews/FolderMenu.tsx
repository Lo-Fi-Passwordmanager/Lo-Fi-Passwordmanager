import React, {useEffect, useRef} from "react";
import {HiMiniPlus} from "react-icons/hi2";
import {HiPencil, HiTrash} from "react-icons/hi";
import {useFolderMenuViewModel} from "../../ViewModels/Menu/FolderMenuViewModel.ts";

interface Props {
    onDelete: () => void;
    onRename: () => void;
    onAdd: () => void;
    disabled: boolean;
}

/**
 * A 3-dot menu for folders which contains buttons to create an item, edit the title and delete the folder
 *
 * @param onDelete method to delete the folder
 * @param onRename method to rename the folder
 * @param onAdd method to add a new item to the folder
 * @param disabled whether the menu is disabled
 */
const FolderMenu: React.FC<Props> = ({onDelete, onRename, onAdd, disabled}) => {

    const viewModel = useFolderMenuViewModel();
    const menuRef = useRef<HTMLDivElement>(null);

    // close menu if clicked outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (menuRef.current && menuRef.current.contains(document.activeElement)) {
                viewModel.setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [viewModel]);
    
    return (
        <div className="action-menu-wrapper" ref={menuRef} onClick={(e) => e.stopPropagation()}>

            <div className={`action-items ${viewModel.isOpen ? "open" : ""}`}>
                <button
                    className="listViewTitleHeader button"
                    disabled={!viewModel.isOpen}
                    onClick={() => {
                        onAdd();
                        viewModel.setIsOpen(false);
                    }}>
                    <HiMiniPlus size={24}/>
                </button>
                <button
                    disabled={!viewModel.isOpen}
                    className="listViewTitleHeader button"
                    onClick={() => {
                        onRename();
                        viewModel.setIsOpen(false);
                    }}>
                    <HiPencil size={24}/>
                </button>
                <button
                    className="listViewTitleHeader button"
                    disabled={!viewModel.isOpen}
                    onClick={onDelete}>
                    <HiTrash size={24}/>
                </button>
            </div>

            <button
                className={`listViewTitleHeader button ${viewModel.isOpen ? "active" : ""}`}
                onClick={viewModel.toggleMenu}
                disabled={disabled}
            >
                ⋮
            </button>
        </div>
    );
};

export default FolderMenu;

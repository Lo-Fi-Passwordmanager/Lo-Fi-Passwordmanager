import {useState} from "react";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {useAutomergeFacade} from "../../Utility/useAutomergeFacade.ts";
import type {Item} from "../../Model/Item.ts";
import {loadCurrentSortCriterion, saveCurrentSortCriterion} from "../../Utility/Storage.ts";

export const SortCriteria = {
    Name: "NAME",
    CreatedAt: "CREATED",
    EditedAt: "EDITED",
} as const;
export type SortCriteria = typeof SortCriteria[keyof typeof SortCriteria];


/**
 * The viewmodel for the PasswordView, which stores the currently displayed entry
 *
 * @param automergeFacade the Automergefacade that contains the database to be used
 */
export const usePasswortViewModel = (automergeFacade: AutomergeFacade) => {

    const [inEditablePasswordView, setInEditablePasswordView] = useState(false);
    const [inItemCreation, setInItemCreation] = useState(false);
    const reactiveFacade = useAutomergeFacade(automergeFacade);
    const [curItem, setCurItem] = useState<Item>(reactiveFacade.tree.rootFolder);
    const [curParent, setCurParent] = useState<Item>(reactiveFacade.tree.rootFolder);

    const [curSortCrit, setCurSortCrit] = useState<SortCriteria>(initSortCriterion);
    const [isAscending, setIsAscending] = useState<boolean>(true);

    function initSortCriterion() {
        const savedCriterion = loadCurrentSortCriterion();
        if (savedCriterion && isCriterion(savedCriterion)) {
            return savedCriterion;
        } else {
            return SortCriteria.Name;
        }
    }

    function isCriterion(value: string): value is SortCriteria {
        return Object.values(SortCriteria).includes(value as SortCriteria);
    }
    function getCurSortCriterion() {
        return curSortCrit;
    }

    function setCurSortCriterion(criterion: SortCriteria) {
        setCurSortCrit(criterion);
        saveCurrentSortCriterion(criterion)
    }

    /**
     * returns the current entry that should be shown
     */
    function getCurEntry() {
        return curItem;
    }

    function getInItemCreation() {
        return inItemCreation;
    }

    function getRootFolder() {
        return reactiveFacade.tree.rootFolder;
    }

    function addItem(item: Item, parentId: string) {
        reactiveFacade.insertItem(item, parentId);
        toggleEditablePasswordView();
    }

    function toggleEditablePasswordView() {
        setInEditablePasswordView(!inEditablePasswordView);
    }

    function getInEditablePasswordView() {
        return inEditablePasswordView;
    }

    function getCurParent() {
        return curParent;
    }

    function deleteItem(item: Item) {
        reactiveFacade.deleteItem(item.id);
        item.deleted = true;
        setCurItem(getRootFolder());
    }

    function toggleOrder() {
        setIsAscending(!isAscending);
    }

    return {
        setCurItem,
        getCurEntry,
        getRootFolder,
        addItem,
        toggleEditablePasswordView,
        getInEditablePasswordView,
        getInItemCreation,
        setInItemCreation,
        setCurParent,
        getCurParent,
        deleteItem,
        getCurSortCriterion,
        setCurSortCriterion,
        isAscending,
        toggleOrder,
    };
};
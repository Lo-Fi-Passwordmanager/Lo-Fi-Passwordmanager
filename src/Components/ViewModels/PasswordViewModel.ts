import {useState} from "react";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {useAutomergeFacade} from "../../Utility/useAutomergeFacade.ts";
import type {Item} from "../../Model/Item.ts";
import {
    loadCurrentSortCriterion,
    loadIsAscending,
    saveCurrentSortCriterion,
    saveIsAscending
} from "../../Utility/Storage.ts";

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
    const [isAscending, setIsAscending] = useState<boolean>(initIsAscending);

    function initSortCriterion() {
        const savedCriterion = loadCurrentSortCriterion();
        if (isCriterion(savedCriterion)) {
            return savedCriterion;
        } else {
            return SortCriteria.Name;
        }
    }
    function isCriterion(value: string | null): value is SortCriteria {
        return Object.values(SortCriteria).includes(value as SortCriteria);
    }

    function initIsAscending() {
        const savedBoolean = loadIsAscending();
        if (isBoolean(savedBoolean)) {
            return savedBoolean;
        } else {
            return true;
        }
    }

    function isBoolean(value: boolean | null): value is boolean {
        return typeof value === 'boolean';
    }

    function setAndStoreSortCriterion(criterion: SortCriteria) {
        setCurSortCrit(criterion);
        saveCurrentSortCriterion(criterion)
    }

    function getCurSortCriterion() {
        return curSortCrit;
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
        saveIsAscending(!isAscending);
    }

    return {
        isAscending,

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
        setAndStoreSortCriterion,
        toggleOrder,
        getCurSortCriterion
    };
};
import type {AutomergeItem} from "./AutomergeItem.ts";

export type HistoryItem = {
    /**
     * Die ID des geänderten Items
     */
    itemId: string
    /**
     * Die geänderten Attribute
     */
    changes: Map<string, string | number>
    /**
     * Ob das Item gelöscht wurde
     */
    deleted: boolean
    /**
     * Ob das Item neu angelegt wurde
     */
    new: boolean
    /**
     * Das alte Item (vor der Änderungen), bzw das neue Item, wenn es neu erstellt wurde.
     */
    item: AutomergeItem
}
import type {AutomergeItem} from "./AutomergeItem.ts";

export type HistoryEntry = {
    /**
     * Die ID des geänderten Items
     */
    itemId: string
    /**
     * Die geänderten Attribute
     */
    changes: Map<string, string | number>
    /**
     * Was für eine Art der Modifikation war die Änderung
     */
    type: "new" | "deleted" | "update"
    /**
     * Das alte Item (vor der Änderungen), bzw das neue Item, wenn es neu erstellt wurde.
     */
    item: AutomergeItem
}
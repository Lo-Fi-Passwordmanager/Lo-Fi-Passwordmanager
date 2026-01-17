export abstract class AutomergeItem {
    type: "entry" | "folder"
    name: string;
    createdAt: number;
    editedAt: number;
    parentId: string | null;

    protected constructor(type: "entry" | "folder", name: string, createdAt: number, editedAt: number, parentId: string | null) {
        this.type = type;
        this.name = name;
        this.createdAt = createdAt;
        this.editedAt = editedAt;
        this.parentId = parentId;
    }
}
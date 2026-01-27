import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {Folder} from "../../../src/Model/Folder";
import {Entry} from "../../../src/Model/Entry";
import {act, renderHook} from "@testing-library/react";
import {useListViewModel} from "../../../src/Components/ViewModels/ListViewModel";
import {SortCriteria} from "../../../src/Components/ViewModels/PasswordViewModel";

describe("ListViewModel", () => {

    const root = new Folder("krasser Titel", "123", new Date(), new Date());
    const sortCriteria = SortCriteria.Name;
    const isAscending = true;


    const subFolder1 = new Folder("subFolder 1", "123", new Date(), new Date());
    const entry = new Entry("Name1", "id123", new Date(), new Date(), "benutzer1", "password", "url", "note");
    const entry3 = new Entry("Name3", "id123", new Date(), new Date(), "benutzer1", "password", "url", "note");
    const entry2 = new Entry("Name2", "id234", new Date(), new Date(), "name2", "password", "url", "note");
    root.addItem(subFolder1);
    root.addItem(entry);
    root.addItem(entry2);
    root.addItem(entry3);


    beforeEach(() => {

    });

    afterEach(() => {

    });

    it("should be able to tell when its a folder", () => {
        const {result} = renderHook(() =>
            useListViewModel(root, sortCriteria, isAscending, null, () => {}));
        expect(result.current.isItemFolder()).toBe(true);
        expect(result.current.isItemEntry()).toBe(false);
    });

    it("should be able to tell when its an entry", () => {
        const {result} = renderHook(() => useListViewModel(entry, sortCriteria, isAscending, null, () => {}));
        expect(result.current.isItemFolder()).toBe(false);
        expect(result.current.isItemEntry()).toBe(true);
    });

    it("should be able to return itself", () => {
        const {result} = renderHook(() => useListViewModel(root, sortCriteria, isAscending, null, () => {}));
        expect(result.current.getItem()).toStrictEqual(root);
    });

    it("should be able to return its children", () => {
        const {result} = renderHook(() => useListViewModel(root, sortCriteria, isAscending, null, () => {}));
        const children = result.current.getChildren();
        expect(children.length).toBe(4);
        const sortedByTitle = [subFolder1, entry, entry2, entry3].sort((a, b) => a.title.localeCompare(b.title));
        expect(children).toStrictEqual(sortedByTitle);
    });

    it("should correctly handle to extended state", () => {
        const {result} = renderHook(() => useListViewModel(root, sortCriteria, isAscending, null, () => {}));
        expect(result.current.getExtended()).toBe(true);
        act(() => {
            result.current.toggleExtended();
        });
        expect(result.current.getExtended()).toBe(false);
        act(() => {
            result.current.toggleExtended();
        });
        expect(result.current.getExtended()).toBe(true);
    });

    it("should return nothing as childern when the item is an entry", () => {
        const {result} = renderHook(() => useListViewModel(entry, sortCriteria, isAscending, null, () => {}));
        expect(result.current.getChildren()).toBe(undefined);
    });
});
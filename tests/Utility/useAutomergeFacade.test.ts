import {afterEach, beforeEach, describe, it, expect, vi} from "vitest";
import {Repo} from "@automerge/react";
import {AutomergeFacade} from "../../src/Utility/AutomergeFacade";
import {act, renderHook} from "@testing-library/react";
import {useAutomergeFacade} from "../../src/Utility/useAutomergeFacade";
import {Entry} from "../../src/Model/Entry";
import {Folder} from "../../src/Model/Folder";
import * as AutomergeReact from '@automerge/react';
import * as AutomergeHelper from "../../src/Utility/AutomergeHelper";

vi.mock("@automerge/react", () => ({
    useDocument: vi.fn()
}));

vi.mock("../../src/Utility/AutomergeHelper", () => ({
    automergeItemFromDatabaseItem: vi.fn(),
    buildDatabaseAsTree: vi.fn(),
    deleteValue: vi.fn(),
    insertValue: vi.fn(),
    isFolder: vi.fn(),
    updateValue: vi.fn()
}));

describe('useAutomergeFacade', () => {
    let automergeFacade: Partial<AutomergeFacade>;
    let secProvider;
    let doc;
    let changeDoc;

    const testItem = {id: '123', name: 'test'} as any;

    beforeEach(() => {
        vi.clearAllMocks();

        secProvider = {
            encryptValue: vi.fn((val) => `encrypted(${val})`),
        };
        automergeFacade = {
            automergeURL: "automerge:test-url" as any,
            getSecurityProvider: vi.fn(() => secProvider)
        } as unknown as AutomergeFacade;
        doc = {
            salt: "salt",
            validation: "validation",
        }
        changeDoc = vi.fn((callback) => callback(doc));
        vi.mocked(AutomergeReact.useDocument).mockReturnValue([doc, changeDoc]);

        vi.mocked(AutomergeHelper.buildDatabaseAsTree).mockReturnValue([
            {id: "root"} as any,
            new Map()
        ]);
    })

    afterEach(() => {

    })

    it('should throw an error if the facades url in null', () => {
        const faultyFacade = {
            ...automergeFacade,
            automergeURL: null
        } as unknown as AutomergeFacade;

        expect(() => renderHook(() => useAutomergeFacade(faultyFacade)))
            .toThrow('The facade was not properly initialized. There is no valid automerge URL.');
    });

    it('should initialize and return the base values correctly', () => {
        const {result} = renderHook(() => useAutomergeFacade(automergeFacade as AutomergeFacade));

        expect(result.current.automergeURL).toBe("automerge:test-url");
        expect(result.current.salt).toBe("salt");
        expect(result.current.validation).toBe("validation");
        expect(result.current.tree).toEqual({id: "root"});
        expect(AutomergeHelper.buildDatabaseAsTree).toHaveBeenCalledWith(doc, secProvider);
    });

    it('should throw an error if the parent id cannot be found', () => {
        const {result} = renderHook(() => useAutomergeFacade(automergeFacade as AutomergeFacade));

        expect(() => result.current.insertItem(testItem, "non-existent-parent-id"))
            .toThrow('Cannot find parent object with ID non-existent-parent-id');
    });

    it('should throw an error if the parent id is not a folder', () => {
        const parentItem = {id: 'parent-id'};
        const itemsMap = new Map<string, any>([['parent-id', parentItem]]);
        vi.mocked(AutomergeHelper.buildDatabaseAsTree).mockReturnValue([{} as any, itemsMap]);
        vi.mocked(AutomergeHelper.isFolder).mockReturnValue(false);

        const {result} = renderHook(() => useAutomergeFacade(automergeFacade as AutomergeFacade));

        expect(() => result.current.insertItem(testItem, 'parent-id'))
            .toThrow('Cannot insert item into Item with ID parent-id, as it is not a folder.');
    });

    it('should insert an item correctly', () => {
        const parentItem = {id: 'parent-id'};
        const itemsMap = new Map<string, any>([['parent-id', parentItem]]);
        vi.mocked(AutomergeHelper.buildDatabaseAsTree).mockReturnValue([{} as any, itemsMap]);
        vi.mocked(AutomergeHelper.isFolder).mockReturnValue(true);

        vi.mocked(AutomergeHelper.insertValue).mockReturnValue('new-item-id');
        const automergeItem = {amId: 'am-id'};
        vi.mocked(AutomergeHelper.automergeItemFromDatabaseItem).mockReturnValue(automergeItem as any);

        const {result} = renderHook(() => useAutomergeFacade(automergeFacade as AutomergeFacade));

        let newId;
        act(() => {
            newId = result.current.insertItem(testItem, 'parent-id');
        });

        expect(newId).toBe('new-item-id');
        expect(changeDoc).toHaveBeenCalled();
        expect(AutomergeHelper.insertValue).toHaveBeenCalledWith(doc, parentItem, automergeItem);
    });

    it('should delete an item correctly', () => {
        const itemMap = new Map();
        vi.mocked(AutomergeHelper.buildDatabaseAsTree).mockReturnValue([{} as any, itemMap]);

        const {result} = renderHook(() => useAutomergeFacade(automergeFacade as AutomergeFacade));

        act(() => {
            result.current.deleteItem('item-id');
        });

        expect(changeDoc).toHaveBeenCalled();
        expect(AutomergeHelper.deleteValue).toHaveBeenCalledWith(doc, 'item-id', itemMap);
    });

    it('should update an item correctly', () => {
        const itemMap = new Map();
        vi.mocked(AutomergeHelper.buildDatabaseAsTree).mockReturnValue([{} as any, itemMap]);

        const {result} = renderHook(() => useAutomergeFacade(automergeFacade as AutomergeFacade));

        act(() => {
            result.current.updateItem('item-id',
                [['name', 'new-name'],
                    ['parentId', 'new-parent-id']]);
        });

        expect(changeDoc).toHaveBeenCalled();
        expect(AutomergeHelper.updateValue).toHaveBeenCalledWith(doc, 'item-id', itemMap, 'name', 'encrypted(new-name)');
        expect(AutomergeHelper.updateValue).toHaveBeenCalledWith(doc, 'item-id', itemMap, 'parentId', 'new-parent-id');
        expect(AutomergeHelper.updateValue).toHaveBeenCalledWith(doc, 'item-id', itemMap, 'editedAt', expect.any(Date));
    });
})
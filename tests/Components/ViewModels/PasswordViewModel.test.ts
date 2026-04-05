import {afterEach, beforeEach, describe, it, expect, vi} from "vitest";
import {AutomergeFacade} from "../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";
import {renderHook, act} from "@testing-library/react";
import {usePasswordViewModel} from "../../../src/Components/ViewModels/PasswordViewModel";
import {Entry} from "../../../src/Model/Entry";
import {Folder} from "../../../src/Model/Folder";
import {SecurityProvider} from "../../../src/Utility/Security/SecurityProvider";
import * as AutomergeFacadeHook from "../../../src/Utility/useAutomergeFacade";

describe('PasswordViewModel', () => {
    let automergeFacade: AutomergeFacade;
    let itemsDeleted: string[];
    let justSynced: boolean;
    let repo;
    let topFolder: Folder;
    let entry: Entry;
    let entry2: Entry;
    let entry3: Entry;
    let subFolder1: Folder;
    let rootFolder: Folder;
    let testFolder: Folder;

    vi.mock("@automerge/react", async (importOriginal) => {
        const actual = await importOriginal<typeof import("@automerge/react")>()

        return {
            ...actual,
            useDocument: vi.fn(() => {
                return [
                    {
                        salt: "aaaa",
                        validation: "validation",
                        items: [],
                    },
                    vi.fn(),
                ]
            }),
        }
    });

    beforeEach(() => {
        repo = new Repo();
        const secProv = new SecurityProvider();
        const salt = secProv.getNewSalt();
        const validation = secProv.getNewValidation("1234", salt);
        secProv.verifyMasterPassword("1234", salt, validation)
        automergeFacade = new AutomergeFacade(repo, undefined, secProv);
        automergeFacade.createDatabase(salt, validation);
        itemsDeleted = [];
        justSynced = false;

        topFolder = new Folder("TopFolder", "123", new Date(1), new Date(2));
        subFolder1 = new Folder("subFolder 1", "123", new Date(4), new Date(8));
        entry = new Entry("Name1", "id123", new Date(3), new Date(6), "benutzer1", "password", "url", "note");
        entry3 = new Entry("Name3", "id123", new Date(2), new Date(12), "benutzer1", "password", "url", "note");
        entry2 = new Entry("Name2", "id234", new Date(5), new Date(10), "name2", "password", "url", "note");
        rootFolder = new Folder("root", "", new Date(), new Date());
        testFolder = new Folder("Test Folder", "1");

        topFolder.addItem(subFolder1);
        topFolder.addItem(entry);
        topFolder.addItem(entry2);
        topFolder.addItem(entry3);
    })

    afterEach(() => {

    })

    it('should be able toset the current item', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        act(() => {
            result.current.setCurItem(entry);
        })
        expect(result.current.curItem).toStrictEqual(entry);
    });

    it('should be able to toggle whether to hide the password', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        expect(result.current.hidePassword).toBe(true);
        act(() => {
            result.current.toggleHidePassword();
        });
        expect(result.current.hidePassword).toBe(false);
        act(() => {
            result.current.toggleHidePassword();
        });
        expect(result.current.hidePassword).toBe(true);
    });

    it('should be able to return whether it is in item creation', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        expect(result.current.inEditable).toBe(false);
        act(() => {
            result.current.toggleInEdit();
        });
        expect(result.current.inEditable).toBe(true);
        act(() => {
            result.current.toggleInEdit();
        });
        expect(result.current.inEditable).toBe(false);
    });

    it('should be able to toggle whether the ordner is ascending or descending', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        expect(result.current.isAscending).toBe(true);
        act(() => {
            result.current.toggleOrder();
        });
        expect(result.current.isAscending).toBe(false);
        act(() => {
            result.current.toggleOrder();
        });
        expect(result.current.isAscending).toBe(true);
    });

    it('should be able to add an entry in temp editable state', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        act(() => {
            result.current.addItem(entry);
        });
        expect(result.current.curItem).toStrictEqual(entry);
    });


    it('should be able to add a folder', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        act(() => {
            result.current.addItem(testFolder);
        });
        expect(result.current.curItem).toStrictEqual(testFolder);
    });


    it('should change the sort criterion and persist it', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        expect(result.current.curSortCrit).toBe("NAME");
        act(() => {
            result.current.setAndStoreSortCriterion("EDITED");
        });
        expect(result.current.curSortCrit).toBe("EDITED");
        expect(localStorage.getItem("currentSortCriterion")).toBe("EDITED");
    });


    it('should set an item to be deleted and delete after confirmation', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        act(() => {
            result.current.setCurItem(entry);
        })
        act(() => {
            result.current.deleteItem(result.current.curItem);
        });
        expect(result.current.itemToDelete).toStrictEqual(entry);

        act(() => {
            result.current.confirmDeletion(result.current.curItem);
        });
        expect(result.current.itemToDelete).toBeNull();
        expect(result.current.curItem).not.toStrictEqual(entry);
        expect(result.current.curItem === result.current.curParent)
        //expect(result.current.curParent.id === entry.parentId)
        expect(entry.deleted).toBe(true);
    });

    it('should not delete the root folder on deletion confirmation', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        act(() => {
            result.current.setCurItem(rootFolder);
        })
        act(() => {
            result.current.deleteItem(result.current.curItem);
        });
        expect(result.current.itemToDelete).not.toStrictEqual(rootFolder);
    });

    it('copy to clipboard works', async () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        const writeTextMock = vi.fn();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigator.clipboard = {
            writeText: writeTextMock,
        };

        act(() => {
            result.current.copyToClipboardAndClear("sample text");
        });

        expect(writeTextMock).toHaveBeenCalledWith("sample text");
    });


    it('deleting clipboard works', () => {
        vi.useFakeTimers()
        vi.spyOn(document, 'hasFocus').mockReturnValue(true)

        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced))

        const writeTextMock = vi.fn();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigator.clipboard = {
            writeText: writeTextMock,
        };

        act(() => {
            result.current.copyToClipboardAndClear('sample text', 10000)
        })
        expect(writeTextMock).toHaveBeenLastCalledWith('sample text')

        vi.advanceTimersByTime(10000)
        expect(writeTextMock).toHaveBeenLastCalledWith('');
    })


    it('deleting clipboard after copying again works', () => {
        vi.useFakeTimers()
        vi.spyOn(document, 'hasFocus').mockReturnValue(true)

        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced))

        const writeTextMock = vi.fn();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigator.clipboard = {
            writeText: writeTextMock,
        };

        act(() => {
            result.current.copyToClipboardAndClear('sample text', 10000)
        })
        expect(writeTextMock).toHaveBeenLastCalledWith('sample text')


        vi.advanceTimersByTime(5000)


        act(() => {
            result.current.copyToClipboardAndClear('sample text2', 10000)
        })
        expect(writeTextMock).toHaveBeenLastCalledWith('sample text2')

        vi.advanceTimersByTime(5000)

        expect(writeTextMock).toHaveBeenLastCalledWith('sample text2');

        vi.advanceTimersByTime(5000)
        expect(writeTextMock).toHaveBeenLastCalledWith('');
    })


    it('deleting clipboard works even when out of focus', () => {
        vi.useFakeTimers()
        vi.spyOn(document, 'hasFocus').mockReturnValue(false)

        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced))

        const writeTextMock = vi.fn();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigator.clipboard = {
            writeText: writeTextMock,
        };

        act(() => {
            result.current.copyToClipboardAndClear('sample text', 10000)
        })
        expect(writeTextMock).toHaveBeenLastCalledWith('sample text')

        vi.advanceTimersByTime(10000)
        expect(writeTextMock).toHaveBeenLastCalledWith('sample text');

        //simulates focusing back into tab
        vi.spyOn(document, 'hasFocus').mockReturnValue(true);
        act(() => {
            window.dispatchEvent(new Event('focus'))
        })
        expect(writeTextMock).toHaveBeenLastCalledWith('');
    })


    it('should be able to sort according to criteria', () => {
        let {result} = renderHook(() =>
            usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        act(() => {
            result.current.setCurSortCrit("NAME");
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([entry, entry2, entry3, subFolder1]);

        ({result} = renderHook(() =>
            usePasswordViewModel(automergeFacade, itemsDeleted, justSynced)));
        act(() => {
            result.current.setCurSortCrit("NAME");
            result.current.setIsAscending(false);
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([subFolder1, entry3, entry2, entry]);

        ({result} = renderHook(() =>
            usePasswordViewModel(automergeFacade, itemsDeleted, justSynced)));
        act(() => {
            result.current.setCurSortCrit("CREATED");
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([entry3, entry, subFolder1, entry2]);

        ({result} = renderHook(() =>
            usePasswordViewModel(automergeFacade, itemsDeleted, justSynced)));
        act(() => {
            result.current.setCurSortCrit("CREATED");
            result.current.setIsAscending(false);
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([entry2, subFolder1, entry, entry3]);

        ({result} = renderHook(() =>
            usePasswordViewModel(automergeFacade, itemsDeleted, justSynced)));
        act(() => {
            result.current.setCurSortCrit("EDITED");
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([entry, subFolder1, entry2, entry3]);

        ({result} = renderHook(() =>
            usePasswordViewModel(automergeFacade, itemsDeleted, justSynced)));
        act(() => {
            result.current.setCurSortCrit("EDITED");
            result.current.setIsAscending(false);
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([entry3, entry2, subFolder1, entry]);
    })

    it('should create a temporary entry within the automerge doc with the current parent and set it to be the current item', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        act(() => {
            result.current.createEntry(topFolder);
        });
        act(() => {
            result.current.createEntry(entry);
        });
        expect(result.current.curItem).toStrictEqual(entry);
        expect(result.current.curParent.id).toBe(topFolder.id);
    });

    it('should update attributes of an item', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        act(() => {
            result.current.setCurItem(entry);
        });
        act(() => {
            result.current.updateItemAttribute(entry.id, [["password", "newPassword"]]);
        });
        expect(result.current.curItem.id).toBe("");
        expect(result.current.dirtyItemId).toBe(entry.id);
    });

    it('should update the title of an item', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        act(() => {
            result.current.setCurItem(entry);
        });
        act(() => {
            result.current.updateItemTitle(entry.id, "newTitle");
        });
        expect(result.current.curItem.id).toBe(entry.id);
    });

    it('should go to an item and expand all parent folders', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        const root = result.current.getRootFolder();
        act(() => {
            root.addItem(topFolder);
            topFolder.addItem(subFolder1);
            subFolder1.addItem(entry);
        });
        act(() => {
            result.current.goToItem(entry);
        });
        expect(result.current.searchValue).toBe("");
        expect(result.current.selectedItemId).toBe(entry.id);
        expect(result.current.isFolderExpanded(topFolder.id)).toBe(true);
        expect(result.current.isFolderExpanded(subFolder1.id)).toBe(true);
    });

    it('should expand a single folder and collaps it', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));
        expect(result.current.isFolderExpanded(topFolder.id)).toBe(false);
        act(() => {
            result.current.expandFolder(topFolder.id);
        });
        expect(result.current.isFolderExpanded(topFolder.id)).toBe(true);
        act(() => {
            result.current.collapseFolder(topFolder.id);
        });
        expect(result.current.isFolderExpanded(topFolder.id)).toBe(false);
    });

    it('should do nothing if an item is dropped on nothing', () => {
        const facadeSpy = vi.spyOn(AutomergeFacadeHook, 'useAutomergeFacade');
        const { result } = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));

        const reactiveFacade = facadeSpy.mock.results[facadeSpy.mock.results.length - 1].value;
        const updateItemSpy = vi.spyOn(reactiveFacade, 'updateItem');

        act(() => {
            result.current.handleDragEnd({ active: { id: entry.id }, over: null } as any);
        });
        expect(updateItemSpy).not.toHaveBeenCalled();
        facadeSpy.mockRestore();
    });

    it('should do nothing if the item is dropped onto itself', () => {
        const facadeSpy = vi.spyOn(AutomergeFacadeHook, 'useAutomergeFacade');
        const { result } = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));

        const reactiveFacade = facadeSpy.mock.results[facadeSpy.mock.results.length - 1].value;
        const updateItemSpy = vi.spyOn(reactiveFacade, 'updateItem');

        act(() => {
            result.current.handleDragEnd({
                active: { id: entry.id },
                over: { id: entry.id }
            } as any);
        });

        expect(updateItemSpy).not.toHaveBeenCalled();
    });

    it('should update the parentId and expand the new folder if valid drop', () => {
        const facadeSpy = vi.spyOn(AutomergeFacadeHook, 'useAutomergeFacade');
        const { result } = renderHook(() => usePasswordViewModel(automergeFacade, itemsDeleted, justSynced));

        const reactiveFacade = facadeSpy.mock.results[facadeSpy.mock.results.length - 1].value;
        const updateItemSpy = vi.spyOn(reactiveFacade, 'updateItem');

        act(() => {
            result.current.handleDragEnd({
                active: { id: entry.id },
                over: { id: subFolder1.id }
            } as any);
        });

        expect(updateItemSpy).toHaveBeenCalledTimes(1);
        expect(updateItemSpy).toHaveBeenCalledWith(entry.id, [["parentId", subFolder1.id]]);
        expect(result.current.isFolderExpanded(subFolder1.id)).toBe(true);

        facadeSpy.mockRestore();
    });
});



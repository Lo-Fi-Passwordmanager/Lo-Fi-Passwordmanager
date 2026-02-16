import {afterEach, beforeEach, describe, it, expect, vi} from "vitest";
import {AutomergeFacade} from "../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";
import {renderHook, act} from "@testing-library/react";
import {usePasswordViewModel} from "../../../src/Components/ViewModels/PasswordViewModel";
import {Entry} from "../../../src/Model/Entry";
import {Folder} from "../../../src/Model/Folder";
import {SecurityProvider} from "../../../src/Utility/Security/SecurityProvider";

describe('PasswordViewModel', () => {
    let automergeFacade;
    let repo;
    let topFolder;
    let entry;
    let entry2;
    let entry3;
    let subFolder1;
    let rootFolder;
    let testFolder;

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
        automergeFacade = new AutomergeFacade(repo, null, secProv);
        automergeFacade.createDatabase(salt, validation);

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
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade));
        act(() => {
            result.current.setCurItem(entry);
        })
        expect(result.current.curItem).toStrictEqual(entry);
    });

    it('should be able to toggle whether to hide the password', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade));
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
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade));
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
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade));
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
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade));
        act(() => {
            result.current.addItem(entry);
        });
        expect(result.current.curItem).toStrictEqual(entry);
    });
    
    
    it('should be able to add a folder', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade));
        act(() => {
            result.current.addItem(testFolder);
        });
        expect(result.current.curItem).toStrictEqual(testFolder);
    });


    it('should change the sort criterion and persist it', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade));
        expect(result.current.curSortCrit).toBe("NAME");
        act(() => {
            result.current.setAndStoreSortCriterion("EDITED");
        });
        expect(result.current.curSortCrit).toBe("EDITED");
        expect(localStorage.getItem("currentSortCriterion")).toBe("EDITED");
    });


    it('should set an item to be deleted and delete after confirmation', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade));
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
        expect(result.current.curParent.id === entry.parentId)
        expect(entry.deleted).toBe(true);
    });

    it('should not delete the root folder on deletion confirmation', () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade));
        act(() => {
            result.current.setCurItem(rootFolder);
        })
        act(() => {
            result.current.deleteItem(result.current.curItem);
        });
        expect(result.current.itemToDelete).not.toStrictEqual(rootFolder);
    });

    it('copy to clipboard works', async () => {
        const {result} = renderHook(() => usePasswordViewModel(automergeFacade));
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

        const { result } = renderHook(() => usePasswordViewModel(automergeFacade))

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

        const { result } = renderHook(() => usePasswordViewModel(automergeFacade))

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

        const { result } = renderHook(() => usePasswordViewModel(automergeFacade))

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
            usePasswordViewModel(automergeFacade));
        act(() => {
            result.current.setCurSortCrit("NAME");
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([entry, entry2, entry3, subFolder1]);

        ({result} = renderHook(() =>
            usePasswordViewModel(automergeFacade)));
        act(() => {
            result.current.setCurSortCrit("NAME");
            result.current.setIsAscending(false);
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([subFolder1, entry3, entry2, entry]);

        ({result} = renderHook(() =>
            usePasswordViewModel(automergeFacade)));
        act(() => {
            result.current.setCurSortCrit("CREATED");
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([entry3, entry, subFolder1, entry2]);

        ({result} = renderHook(() =>
            usePasswordViewModel(automergeFacade)));
        act(() => {
            result.current.setCurSortCrit("CREATED");
            result.current.setIsAscending(false);
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([entry2, subFolder1, entry, entry3]);

        ({result} = renderHook(() =>
            usePasswordViewModel(automergeFacade)));
        act(() => {
            result.current.setCurSortCrit("EDITED");
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([entry, subFolder1, entry2, entry3]);

        ({result} = renderHook(() =>
            usePasswordViewModel(automergeFacade)));
        act(() => {
            result.current.setCurSortCrit("EDITED");
            result.current.setIsAscending(false);
        });
        expect(result.current.getSortedChildren(topFolder)).toStrictEqual([entry3, entry2, subFolder1, entry]);
    })

});

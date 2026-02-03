import {afterEach, beforeEach, describe, it, expect, vi} from "vitest";
import {AutomergeFacade} from "../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";
import {renderHook, act} from "@testing-library/react";
import {usePasswortViewModel} from "../../../src/Components/ViewModels/PasswordViewModel";
import {Entry} from "../../../src/Model/Entry";
import {Folder} from "../../../src/Model/Folder";

describe('PasswordViewModel', () => {
    let automergeFacade;
    let repo;
    let entry;
    let rootFolder;

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
        automergeFacade = new AutomergeFacade(repo);
        automergeFacade.createDatabase("salt", "validation", "Database");
        entry = new Entry("name", "id", new Date(), new Date(), "user", "pass", "url", "note");
        rootFolder = new Folder("root", "", new Date(), new Date());
    })

    afterEach(() => {

    })

    it('should be able toset the current item', () => {
        const {result} = renderHook(() => usePasswortViewModel(automergeFacade));
        act(() => {
            result.current.setCurItem(entry);
        })
        expect(result.current.curItem).toStrictEqual(entry);
    });

    it('should be able to toggle whether to hide the password', () => {
        const {result} = renderHook(() => usePasswortViewModel(automergeFacade));
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
        const {result} = renderHook(() => usePasswortViewModel(automergeFacade));
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
        const {result} = renderHook(() => usePasswortViewModel(automergeFacade));
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

    it('should be able to add an entry', () => {
        const {result} = renderHook(() => usePasswortViewModel(automergeFacade));
        act(() => {
            result.current.addItem(entry);
        });
        expect(result.current.curItem).toStrictEqual(entry);
    });


    it('should change the sort criterion and persist it', () => {
        const {result} = renderHook(() => usePasswortViewModel(automergeFacade));
        expect(result.current.curSortCrit).toBe("NAME");
        act(() => {
            result.current.setAndStoreSortCriterion("EDITED");
        });
        expect(result.current.curSortCrit).toBe("EDITED");
        expect(localStorage.getItem("currentSortCriterion")).toBe("EDITED");
    });

    // doesnt work bc of automerge :(
    // it('should return the root folder', () => {
    //     const {result} = renderHook(() => usePasswortViewModel(automergeFacade));
    //     expect(result.current.getRootFolder().entries.length).toBe(0);
    //     act(() => {
    //         result.current.addItem(folder);
    //     });
    //     expect(result.current.getRootFolder().entries.length).toBe(1);
    // });

    it('should set an item to be deleted and delete after confirmation', () => {
        const {result} = renderHook(() => usePasswortViewModel(automergeFacade));
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
        const {result} = renderHook(() => usePasswortViewModel(automergeFacade));
        act(() => {
            result.current.setCurItem(rootFolder);
        })
        act(() => {
            result.current.deleteItem(result.current.curItem);
        });
        expect(result.current.itemToDelete).not.toStrictEqual(rootFolder);
    });

    it('copy to clipboard works as expected', async () => {
        const {result} = renderHook(() => usePasswortViewModel(automergeFacade));
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

});

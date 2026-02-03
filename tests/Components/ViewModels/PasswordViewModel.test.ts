import {afterEach, beforeEach, describe, it, expect, vi} from "vitest";
import {AutomergeFacade} from "../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";
import {renderHook, act} from "@testing-library/react";
import {usePasswortViewModel} from "../../../src/Components/ViewModels/PasswordViewModel";
import {Entry} from "../../../src/Model/Entry";
import {Folder} from "../../../src/Model/Folder";

describe('PasswordViewModel',() => {
    let automergeFacade;
    let repo;
    let entry;
    let folder;

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
        folder = new Folder("folderName", "folderId", new Date(), new Date());
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

    })

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
});

import {afterEach, beforeEach, describe, it, expect, vi} from "vitest";
import {AutomergeFacade} from "../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";
import {renderHook, act} from "@testing-library/react";
import {SortCriteria, usePasswortViewModel} from "../../../src/Components/ViewModels/PasswordViewModel";
import {Entry} from "../../../src/Model/Entry";
import {Folder} from "../../../src/Model/Folder";

describe('PasswordViewModel',() => {
    let automergeFacade;
    let repo;
    let entry;
    let folder;
    let sortCriterium: SortCriteria;

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

    beforeEach(()=> {
        repo = new Repo();
        automergeFacade = new AutomergeFacade(repo);
        automergeFacade.createDatabase("salt", "validation", "Database");
        entry = new Entry("name", "id", new Date(), new Date(), "user", "pass", "url", "note");
        folder = new Folder("name", "id", new Date(), new Date())
    })

    afterEach(() => {

    })

    it('should be able toset the current item',() => {
        const { result } = renderHook(() => usePasswortViewModel(automergeFacade));
        act(() => {
            result.current.setCurItem(entry);
        })
        expect(result.current.getCurEntry()).toStrictEqual(entry);
    });

    it('should be able to toggle whether to hide the password', ()=> {
        const { result } = renderHook(() => usePasswortViewModel(automergeFacade));
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

    it('should be able to set and store the sortCriterium', ()=>{
        sortCriterium = "EDITED";
        const { result } = renderHook(() => usePasswortViewModel(automergeFacade));
        act(() => {
            result.current.setAndStoreSortCriterion(sortCriterium);
        });
        expect(result.current.getCurSortCriterion()).toBe(sortCriterium);
    });

    it('should be able to return whether it is in item creation', ()=> {
        const { result } = renderHook(() => usePasswortViewModel(automergeFacade));
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

    it('should be able to copy to the clipboard', ()=> {
        const { result } = renderHook(() => usePasswortViewModel(automergeFacade));
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

    it('should be able to add an entry', ()=> {
        const { result } = renderHook(() => usePasswortViewModel(automergeFacade));
        act(() => {
            result.current.addItem(entry);
        });
        expect(result.current.getCurEntry()).toStrictEqual(entry);
    });


})

import {afterEach, beforeEach, describe, it, expect, vi} from "vitest";
import {Repo} from "@automerge/react";
import {AutomergeFacade} from "../../src/Utility/AutomergeFacade";
import {act, renderHook} from "@testing-library/react";
import {useAutomergeFacade} from "../../src/Utility/useAutomergeFacade";
import {Entry} from "../../src/Model/Entry";
import {SecurityProvider} from "../../src/Utility/Security/SecurityProvider";
import {Folder} from "../../src/Model/Folder";

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
})
//TODO fix alles hier
describe('useAutomergeFacade', ()=> {
    let automergeFacade;
    let repo;
    let secProvider;
    const entry = new Entry("name", "00", new Date(), new Date(), "user", "password", "url", "note");
    const folder = new Folder("name", "01", new Date(), new Date());


    beforeEach(() => {
        repo = new Repo();
        secProvider = new SecurityProvider();
        secProvider.getNewValidation("password", "aaaa");
        automergeFacade = new AutomergeFacade(repo, undefined, secProvider);
        automergeFacade.createDatabase("aaaa", "validation", "database");
    })

    afterEach(() => {

    })

    it('should throw if the facades url in null', ()=> {
        automergeFacade = new AutomergeFacade(repo, undefined, secProvider);
        let result;
        try {
            result = renderHook(() => useAutomergeFacade(automergeFacade));
        } catch {
            result = null;
        }
        expect(result).toBe(null);
    })

    it('should be able to insert new items into the root tree', ()=> {
        const {result} = renderHook(() => useAutomergeFacade(automergeFacade));
        act(()=> {
            result.current.insertItem(folder, "");
        })
        //expect(result.current.tree.getChildById("01")).toBeInstanceOf(Folder);
    })

    it('should throw if the inserts parent is undefinded', ()=> {
        const {result} = renderHook(() => useAutomergeFacade(automergeFacade));
        expect(() => {
            act(() => {
                result.current.insertItem(folder, "23");
            })
        }).toThrow("Cannot find parent object with ID 23")
    })

    it('should throw if the inserts parent is an entry', ()=> {
        const {result} = renderHook(() => useAutomergeFacade(automergeFacade));
        act(() => {
            result.current.insertItem(entry, "");
        })
        act(() => {
            //console.log(result.current.tree.getChildById("00"));
        })
        /*
        expect(() => {
            act(() => {
                result.current.insertItem(folder, "00");
            })
        }).toThrow("Cannot insert item into Item with ID 00, as it is not a folder.")
         */
    })

    it('should be able to delete an item', ()=> {
        const {result} = renderHook(() => useAutomergeFacade(automergeFacade));
        act(() => {
            result.current.insertItem(entry, "");
        })
        act(()=> {
            //expect(result.current.tree.getChildById("00")).toBeInstanceOf(Entry);
        })
        act(() => {
            //result.current.deleteItem("00");
        })
        act(()=> {
            //expect(result.current.tree.getChildById("00")).toBe(null);
        })
    })

    it('should be able to update an item', ()=> {
        const {result} = renderHook(() => useAutomergeFacade(automergeFacade));
        //let changedEntry;
        act(() => {
            result.current.insertItem(entry, "");
        })
        act(()=> {
            //expect(result.current.tree.getChildById("00")).toBeInstanceOf(Entry);
        })
        act(() => {
            //result.current.updateItem("00", [["name", "newName"]]);
        })
        act(()=> {
            //changedEntry = result.current.tree.getChildById;
        })
        //expect(changedEntry.name).toBe("newName");
    })
})
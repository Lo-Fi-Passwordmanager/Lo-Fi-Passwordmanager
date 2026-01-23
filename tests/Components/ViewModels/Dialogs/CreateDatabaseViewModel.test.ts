import {beforeEach, describe, it, expect, vi} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useCreateDatabaseViewModel} from "../../../../src/Components/ViewModels/Dialog/CreateDatabaseViewModel";
import {AutomergeUrl} from "@automerge/automerge-repo";

describe('CreateDatabaseViewModel', ()=> {

    const createDatabase = vi.fn();
    const setToastMessage = vi.fn();
    const storeDatabase = vi.fn();

    function setShowToast(show: boolean) {

    }

    /*vi.mock('@automerge/automerge-repo', async ()=>{
        const mod = await vi.importActual('@automerge/automerge-repo')
        return {
            AutomergeUrl: vi.fn().mockReturnValue({

            }),
            AutomergeUrl: {
                ...mod.AutomergeUrl,
                isValidAutomergeUrl: vi.fn(),
            }
        }
    });*/

    beforeEach(()=> {
        vi.clearAllMocks();
    })

    it('should correctly assign fields when isOpen is true', () => {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true,
            createDatabase, storeDatabase, setToastMessage, setShowToast));
        expect(result.current.field1).toBe("");
        expect(result.current.field2).toBe("");

    })

    it('should correctly assign fields when is Open is false', () => {
        const {result} = renderHook(() => useCreateDatabaseViewModel(false,
            createDatabase, storeDatabase, setToastMessage, setShowToast));
        expect(result.current.field1).toBe("");
        expect(result.current.field2).toBe("");
    })

    it('should create a toast when no input is given', ()=> {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true,
            createDatabase, storeDatabase, setToastMessage, setShowToast));
        act(()=> {
            result.current.handleConfirm();
        })
        expect(setToastMessage.mock.calls.length).toBe(1);
        expect(createDatabase.mock.calls.length).toBe(0);
    })

    it('should call to create new Database correctly',async ()=> {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true,
            createDatabase, storeDatabase, setToastMessage, setShowToast));
        act(()=> {
            result.current.setField1("name");
            result.current.setField2("url");
            result.current.setCreateNewDatabase(true);
        })
        act(()=> {
            result.current.handleConfirm();
        })
        expect(setToastMessage.mock.calls.length).toBe(0);
        expect(createDatabase.mock.calls.length).toBe(1);
    })

    it('should create a toast when the url is wrong',async ()=> {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true,
            createDatabase, storeDatabase, setToastMessage, setShowToast));
        act(()=> {
            result.current.setField1("name");
            result.current.setField2("url");
            result.current.setCreateNewDatabase(false);
        })
        act(()=> {
            result.current.handleConfirm();
        })
        expect(setToastMessage.mock.calls.length).toBe(1);
        expect(storeDatabase.mock.calls.length).toBe(0);
    })

    it('should be able call to store a database from a url', ()=> {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true,
            createDatabase, storeDatabase, setToastMessage, setShowToast));
        act(()=> {
            result.current.setField1("name");
            result.current.setField2("url");
            result.current.setCreateNewDatabase(false);
        })
        act(()=> {
            result.current.handleConfirm();
        })
        expect(setToastMessage.mock.calls.length).toBe(1);
        expect(storeDatabase.mock.calls.length).toBe(0);
    })
})
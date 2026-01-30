import {beforeEach, describe, it, expect, vi} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useCreateDatabaseViewModel} from "../../../../src/Components/ViewModels/Dialog/CreateDatabaseViewModel";
import {isValidAutomergeUrl} from "@automerge/react";
import {useState} from "react";

describe('CreateDatabaseViewModel', ()=> {

    const createDatabase = vi.fn();
    const setToastMessage = vi.fn();
    const storeDatabase = vi.fn();
    const setShowToast = vi.fn();
    const importDatabase = vi.fn();


    vi.mock("@automerge/react", async () => {
        const actual = await vi.importActual<any>("@automerge/react");
        return {
            ...actual,
            isValidAutomergeUrl: vi.fn(),
        };
    });

    beforeEach(()=> {
        vi.clearAllMocks();
    })
    //TODO bisschen dummer test
    it('should correctly assign fields when isOpen is true', () => {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true, createDatabase, storeDatabase, setToastMessage, setShowToast, importDatabase));
        expect(result.current.field1).toBe("");
        expect(result.current.field2).toBe("");

    })

    it('should correctly assign fields when is Open is false', () => {
        const {result} = renderHook(() => useCreateDatabaseViewModel(false, createDatabase, storeDatabase, setToastMessage, setShowToast, importDatabase));
        expect(result.current.field1).toBe("");
        expect(result.current.field2).toBe("");
    })

    it('should create a toast when no input is given', ()=> {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true, createDatabase, storeDatabase, setToastMessage, setShowToast, importDatabase));
        act(()=> {
            result.current.handleConfirm();
        })
        expect(setToastMessage.mock.calls.length).toBe(1);
        expect(createDatabase.mock.calls.length).toBe(0);
    })

    it('should call to create new Database correctly',async ()=> {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true, createDatabase, storeDatabase, setToastMessage, setShowToast, importDatabase));
        act(()=> {
            result.current.setField1("name");
            result.current.setField2("url");
            result.current.setSelectedImportType("new");
        })
        act(()=> {
            result.current.handleConfirm();
        })
        expect(setToastMessage.mock.calls.length).toBe(0);
        expect(createDatabase.mock.calls.length).toBe(1);
    })

    it('should create a toast when the url is wrong',async ()=> {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true, createDatabase, storeDatabase, setToastMessage, setShowToast, importDatabase));
        vi.mocked(isValidAutomergeUrl).mockReturnValue(false);
        act(()=> {
            result.current.setField1("name");
            result.current.setField2("url");
            result.current.setSelectedImportType("url");
        })
        act(()=> {
            result.current.handleConfirm();
        })
        expect(setToastMessage.mock.calls.length).toBe(1);
        expect(storeDatabase.mock.calls.length).toBe(0);
    })

    it('should be able call to store a database from a url', ()=> {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true, createDatabase, storeDatabase, setToastMessage, setShowToast, importDatabase));
        vi.mocked(isValidAutomergeUrl).mockReturnValue(true);
        act(()=> {
            result.current.setField1("name");
            result.current.setField2("url");
            result.current.setSelectedImportType("url");
        });
        act(()=> {
            result.current.handleConfirm();
        })
        expect(setToastMessage.mock.calls.length).toBe(0);
        expect(storeDatabase.mock.calls.length).toBe(1);
    });

    it('should be able to call to import a database from a file', async () => {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true, createDatabase, storeDatabase, setToastMessage, setShowToast, importDatabase));
        const fileList: FileList = <FileList>{};
        act(() => {
            result.current.setSelectedImportType("file");
            result.current.setField1("name");
            result.current.setTargetFiles(fileList);
        });
        act(()=> {
            result.current.handleConfirm();
        });
        await waitFor(() => {
            expect(importDatabase.mock.calls.length).toBe(1);
        })
    });

    it('should do nothing if creation type is invalid', async () => {
        const {result} = renderHook(() => useCreateDatabaseViewModel(true, createDatabase, storeDatabase, setToastMessage, setShowToast, importDatabase));
        act(() => {
            result.current.setSelectedImportType("invalid");
            result.current.setField1("stuff");
            result.current.setField2("stuff");
        });
        act(() => {
            result.current.handleConfirm();
        });
        await waitFor(() => {
            expect(importDatabase.mock.calls.length).toBe(0);
            expect(createDatabase.mock.calls.length).toBe(0);
            expect(storeDatabase.mock.calls.length).toBe(0);
        })
    })
})
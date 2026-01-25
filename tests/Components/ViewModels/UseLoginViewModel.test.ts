import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useLoginViewModel} from "../../../src/Components/ViewModels/UseLoginViewModel";
import {Repo} from "@automerge/react";
import {SecurityProvider} from "../../../src/Utility/Security/SecurityProvider";

describe('UseLoginViewModel', () => {
    let repo;
    const setLoggedIn = vi.fn();
    const setAutomergeFacade = vi.fn();
    const setOpenedDbName = vi.fn();
    let secProv: SecurityProvider;
    beforeEach(() => {
        repo = new Repo();
        secProv = new SecurityProvider();
        secProv.getNewValidation("password", secProv.getNewSalt());
    })

    afterEach(() => {

    })


    it("should be able to create a new Database", async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
            expect(setLoggedIn).toHaveBeenCalled();
        });
    })

    it('should not create a new database if the name already exists', async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        act(() => {
            result.current.createDatabase("name", "Password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
    });

    it('should be able to delete a database', async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        act(() => {
            result.current.deleteDatabase("name");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(0);
        });
    })

    it('should an error if a database is attempted to be opened but there is not database given', async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        await expect(result.current.tryOpenDatabase("password")).rejects.toThrow("No database selected");
    })

    it('should be able to import a database from a url', async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        let database;
        act(()=> {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        act(()=> {
            database = result.current.databases.get("name");
        })
        act(()=> {
            result.current.deleteDatabase("name");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(0);
        });
        act(()=> {
            result.current.importDatabaseFromURL("name", database);
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
    })

    it('should be able to reject a wrong import from a url', async ()=> {
        const { result } = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        });
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        await waitFor(() => {
            expect(result.current.databases.get("name")).toBeDefined();
        });
        const database= result.current.databases.get("name");

        act(() => {
            result.current.importDatabaseFromURL("name", database);
        });

        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
    });


})

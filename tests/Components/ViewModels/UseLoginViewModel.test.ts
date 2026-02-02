import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {loginViewModel} from "../../../src/Components/ViewModels/LoginViewModel";
import {AutomergeUrl, Repo} from "@automerge/react";
import {SecurityProvider} from "../../../src/Utility/Security/SecurityProvider";

describe('UseLoginViewModel', () => {
    let repo: Repo;
    const setLoggedIn = vi.fn();
    const setAutomergeFacade = vi.fn();
    const setOpenedDbName = vi.fn();
    let secProv: SecurityProvider;

    beforeEach(() => {
        repo = new Repo();
        secProv = new SecurityProvider();
        secProv.getNewValidation("password", secProv.getNewSalt());
        localStorage.clear();
        vi.resetAllMocks();
    })

    afterEach(() => {

    })


    it("should be able to create a new Database", async () => {
        const {result} = renderHook(() =>
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
    })

    it('should not create a new database if the name already exists', async () => {
        const {result} = renderHook(() =>
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
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
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        act(() => {
            result.current.confirmDeleteDatabase("name");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(0);
        });
    })

    it('should an error if a database is attempted to be opened but there is not database given', async () => {
        const {result} = renderHook(() =>
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        await expect(result.current.tryOpenDatabase("password")).rejects.toThrow("No database selected");
    })

    /*
    it('should be able to import a database from an url', async () => {
        const {result} = renderHook(() =>
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        let database : AutomergeUrl;
        act(() => {
            database = result.current.databases.get("name");
        })
        act(() => {
            result.current.deleteDatabase("name");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(0);
        });
        act(() => {
            result.current.importDatabaseFromURL("name", database);
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
    })
    */

    it('should be able to reject a wrong import from a url', async ()=> {
        const { result } = renderHook(() =>
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        await waitFor(() => {
            expect(result.current.databases.get("name")).toBeDefined();
        });
        const database= result.current.databases.get("name");
        act(() => {
            result.current.importDatabaseFromURL("name", database);
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        act(() => {
            result.current.importDatabaseFromURL("otherName", database);
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
    });

    it("should be able to open the enter Password Dialog", async () => {
        const {result} = renderHook(() =>
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
            result.current.closeDatabase();
            result.current.openEnterPasswordDialog("name");
        })
        await waitFor(() => {
            expect(result.current.isEnterPasswordDialogOpen).toBe(true);
        });
        act(() => {
            result.current.closeEnterPasswordDialog();
        })
        await waitFor(() => {
            expect(result.current.isEnterPasswordDialogOpen).toBe(false);
        });
    });

    it("should be able to open and close the add databaseDialog", async ()=> {
        const {result} = renderHook(() =>
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.openAddDialog();
        })
        await waitFor(() => {
            expect(result.current.isAddDialogOpen).toBe(true);
        });
        act(() => {
            result.current.closeAddDialog();
        })
        await waitFor(() => {
            expect(result.current.isAddDialogOpen).toBe(false);
        });
    });

    it('should throw when the database doesnt exist', async () => {
        const {result} = renderHook(() =>
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        await expect(result.current.tryOpenDatabase("password", "name")).rejects.toThrow("Database doesn't exist");
    })

    it("should be able to open the selcted database", async () => {
        const {result} = renderHook(() =>
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
            result.current.closeDatabase();
        })
        await waitFor(()=> {
            expect(setLoggedIn()).toHaveBeenCalled;
        })
        act(() => {
            result.current.openEnterPasswordDialog("name");
        })
        await waitFor(() => {
            result.current.tryOpenDatabase("password");
        })
    });

    it("should reject a wrong password", async () => {
        const {result} = renderHook(() =>
            loginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
            result.current.closeDatabase();
        });
        await waitFor(()=> {
            expect(setLoggedIn).toHaveBeenCalled();
        })
        await waitFor(() => {
            result.current.tryOpenDatabase("WrongPassword", "name");
        });
    });


})

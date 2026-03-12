import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useLoginViewModel} from "../../../src/Components/ViewModels/loginViewModel";
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
        localStorage.clear();
    })


    it("should be able to create a new Database", async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
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
            result.current.confirmDeleteDatabase("name");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(0);
        });
    })

    it('should an error if a database is attempted to be opened but there is not database given', async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        expect(result.current.tryOpenDatabase("password")).rejects.toThrow("No database selected");
    })

    it('should be able to import a database from an url', async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        let database: AutomergeUrl = result.current.databases.get("name");

        const deleteSpy = vi.spyOn(repo, "delete").mockImplementation(() => {});

        await waitFor(() => {
            result.current.confirmDeleteDatabase("name");
        });
        await waitFor(() => {
            expect(result.current.databases.size).toBe(0);
        })
        act(() => {
            result.current.importDatabaseFromURL("name", database);
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });

        deleteSpy.mockRestore();
    })

    it('should be able to reject a wrong import from a url', async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        await waitFor(() => {
            expect(result.current.databases.get("name")).toBeDefined();
        });
        const database = result.current.databases.get("name");
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
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
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

    it("should be able to open and close the add databaseDialog", async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
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
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        expect(result.current.tryOpenDatabase("password", "name")).rejects.toThrow("Database doesn't exist");
    })

    it("should be able to open the selcted database", async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
            result.current.closeDatabase();
        })
        await waitFor(() => {
            expect(setLoggedIn).toHaveBeenCalled();
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
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.createDatabase("name", "password");
            result.current.closeDatabase();
        });
        await waitFor(() => {
            expect(setLoggedIn).toHaveBeenCalled();
        })
        await waitFor(() => {
            result.current.tryOpenDatabase("WrongPassword", "name");
        });
    });

    it('should change the name of the database', async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        await waitFor(() => {
            expect(result.current.databases.size).toBe(0);
        });
        act(() => {
            result.current.createDatabase("name", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
        });
        act(() => {
            result.current.changeDatabaseName("name", "otherName");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(1);
            expect(result.current.databases.get("otherName")).toBeDefined();
            expect(result.current.databases.get("name")).toBeUndefined();
        });
    });

    it('should not change the name of the database if the new name already exists', async () => {
        const {result} = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        await waitFor(() => {
            expect(result.current.databases.size).toBe(0);
        });
        act(() => {
            result.current.createDatabase("name", "password");
            result.current.createDatabase("otherName", "password");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(2);
        });
        act(() => {
            result.current.changeDatabaseName("name", "otherName");
        })
        await waitFor(() => {
            expect(result.current.databases.size).toBe(2);
            expect(result.current.databases.get("otherName")).toBeDefined();
            expect(result.current.databases.get("name")).toBeDefined();
        });
    });

    // it('should show a toast when an error occurs', async () => {
    //     const {result} = renderHook(() =>
    //         useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
    //     act(() => {
    //         localStorage.setItem("databases", JSON.stringify([["name", "automerge:EmPo3STbfDKx16VXWAeZYzo5p28"]]));
    //     });
    //     await act(async () => {
    //         expect(async () => await result.current.tryOpenDatabase("password", "name")).toThrowError()
    //     });
    //     await waitFor(() => {
    //         expect(result.current.toastMessage).toBe("Automerge konnte die Datenbank nicht laden!");
    //     });
    // });

    it('should fail loading a database from file without file', async () => {
        const {result} = renderHook(() => useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.importDatabaseFromFile(null, "new Database");
        });
        await waitFor(() => {
            expect(result.current.toastMessage).toBe("Bitte wähle eine Datei.");
        });
    })

    it('should fail loading a database from file without name', async () => {
        const {result} = renderHook(() => useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(() => {
            result.current.importDatabaseFromFile(null, "");
        });
        await waitFor(() => {
            expect(result.current.toastMessage).toBe("Bitte wähle einen Namen.");
        });
    })


})

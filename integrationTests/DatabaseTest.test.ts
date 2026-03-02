import {describe, expect, it} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {usePasswordManagerViewModel} from "../src/Components/ViewModels/PasswordManagerViewModel";
import {useLoginViewModel} from "../src/Components/ViewModels/loginViewModel";
import {useHistoryViewModel} from "../src/Components/ViewModels/Dialog/HistoryViewModel";

describe("Database Integrationtests", () => {
    const password = "kuhlesPasswort#123$"
    const dbName = "tolleDatenbank$§\\"



    it('should create and then reopen and load a database', async () => {
        const passwordManagerHook = renderHook(() => usePasswordManagerViewModel());
        const { repo, securityProvider } = passwordManagerHook.result.current;
        const loginViewModelHook = renderHook(() => useLoginViewModel(
            repo,
            passwordManagerHook.result.current.setLoggedIn,
            passwordManagerHook.result.current.setAutomergeFacade,
            securityProvider,
            passwordManagerHook.result.current.setOpenedDatabaseName
        ));



        //create and login / logout
        await act(async () => {
            loginViewModelHook.result.current.createDatabase(dbName, password);
        });
        await waitFor(() => expect(passwordManagerHook.result.current.loggedIn).toBe(true));



        const newDbName = "RenamedDatabase";
        await act(async () => {
            loginViewModelHook.result.current.changeDatabaseName(dbName, newDbName);
        });
        expect(loginViewModelHook.result.current.databaseNames).toContain(newDbName);
        expect(loginViewModelHook.result.current.databaseNames).not.toContain(dbName);



        const facade = passwordManagerHook.result.current.getAutomergeFacade()!;
        const historyHook = renderHook(() => useHistoryViewModel(facade));

        await act(async () => {
            await historyHook.result.current.loadHistory();
        });

        expect(historyHook.result.current.automergeHistory).not.toBeNull();
        expect(historyHook.result.current.automergeHistory!.length).toEqual(0);
        //FIXME getting the repo here to actually add items is weird ~Jesko


        const exportedBinary = await facade.exportAutomergeToBinary();
        expect(exportedBinary).toBeInstanceOf(Uint8Array);


        const shareUrl = facade.automergeURL;
        expect(shareUrl).toContain('automerge:');



        // We clear current login state to simulate a fresh start and add the database again
        await act(async () => {
            passwordManagerHook.result.current.closeLoggedIn();
        });

        const importedDbName = "ImportedFromBinary";
        await act(async () => {
            const handle = repo.import(exportedBinary!);
            await loginViewModelHook.result.current.addDatabase(importedDbName, handle.url);
        });

        await act(async () => {
            await loginViewModelHook.result.current.tryOpenDatabase(password, importedDbName);
        });
        await waitFor(() => expect(passwordManagerHook.result.current.loggedIn).toBe(true));


        await act(async () => {
            loginViewModelHook.result.current.confirmDeleteDatabase(importedDbName);
        });

        expect(loginViewModelHook.result.current.databaseNames).not.toContain(importedDbName);
    });
})
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {Repo} from "@automerge/react";
import {act, renderHook, waitFor} from "@testing-library/react";
import {usePasswordManagerViewModel} from "../src/Components/ViewModels/PasswordManagerViewModel";
import {useLoginViewModel} from "../src/Components/ViewModels/loginViewModel";
import {useSettings} from "../src/Model/Settings";
import {useSettingsViewModel} from "../src/Components/ViewModels/SettingsViewModel";
import {removeDatabase} from "../src/Utility/Storage";
import {SecurityProvider} from "../src/Utility/Security/SecurityProvider";

describe("Database Integrationtests", () => {
    const password = "kuhlesPasswort#123$"
    const dbName = "tolleDatenbank$§\\"


    it('should be able to succesfully create a Database and then use all Export/Share features', async () => {
        //It should be noted that       const PasswordManagerVM = passwordManagerHook.result.current
        //does not work, because the hook is a stale snapshot (the render returns a new object)
        const passwordManagerHook = renderHook(() => usePasswordManagerViewModel());
        const secProv = new SecurityProvider()
        const loginViewModelHook = renderHook(() => useLoginViewModel(passwordManagerHook.result.current.repo, passwordManagerHook.result.current.setLoggedIn, passwordManagerHook.result.current.setAutomergeFacade, secProv, passwordManagerHook.result.current.setOpenedDatabaseName));
        const salt = secProv.getNewSalt()
        const validation = secProv.getNewValidation(password, salt);

        //login in test and wait 500ms for the login process to be completed
        await act(async ()=> {
            loginViewModelHook.result.current.createDatabase(dbName, password);
            await new Promise((resolve) => setTimeout(resolve, 500));
        })

        expect(passwordManagerHook.result.current.loggedIn).toBe(true)

        const settingsHook = renderHook(() => useSettingsViewModel());
        const settingsVM = settingsHook.result.current;
        //FIXME hier fehlt jetzt History check



        //export URL and File Test
        const saveFile = passwordManagerHook.result.current.getAutomergeFacade().exportAutomergeToBinary()
        const url = passwordManagerHook.result.current.getAutomergeFacade().automergeURL

        //close Database and Delete
        removeDatabase(dbName);
        act(()=> {
            passwordManagerHook.result.current.closeLoggedIn();
        })


        //expect(loginVM.tryOpenDatabase(password, dbName)).toThrowError(new Error("No database selected"))
    });
})
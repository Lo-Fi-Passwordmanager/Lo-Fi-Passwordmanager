import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {Repo} from "@automerge/react";
import {renderHook} from "@testing-library/react";
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
        const passwordManagerHook = renderHook(() => usePasswordManagerViewModel());
        const passwordManagerVM = passwordManagerHook.result.current;
        const secProv = new SecurityProvider()
        const loginViewModelHook = renderHook(() => useLoginViewModel(passwordManagerVM.repo, passwordManagerVM.setLoggedIn, passwordManagerVM.setAutomergeFacade, secProv, passwordManagerVM.setOpenedDatabaseName));
        const loginVM = loginViewModelHook.result.current;
        const salt = secProv.getNewSalt()
        const validation = secProv.getNewValidation(password, salt);
        const automergeFacade = passwordManagerVM.getAutomergeFacade();

        //login in test
        loginVM.createDatabase(dbName, password);
        expect(passwordManagerVM.loggedIn).toBe(false)
        await loginVM.tryOpenDatabase("", dbName)
        expect(passwordManagerVM.loggedIn).toBe(false)
        await loginVM.tryOpenDatabase(password, dbName)
        expect(passwordManagerVM.loggedIn).toBe(true)

        const settingsHook = renderHook(() => useSettingsViewModel());
        const settingsVM = settingsHook.result.current;
        //FIXME hier fehlt jetzt History check



        //export URL and File Test
        const saveFile = automergeFacade.exportAutomergeToBinary()
        const url = automergeFacade.automergeURL

        //close Database and Delete
        removeDatabase(dbName);
        passwordManagerVM.closeLoggedIn();

        //expect(loginVM.tryOpenDatabase(password, dbName)).toThrowError(new Error("No database selected"))
    });
})
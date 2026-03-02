import {describe, expect, it, vi} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {usePasswordManagerViewModel} from "../src/Components/ViewModels/PasswordManagerViewModel";
import {useLoginViewModel} from "../src/Components/ViewModels/loginViewModel";
import {useHistoryViewModel} from "../src/Components/ViewModels/Dialog/HistoryViewModel";
import {RepoContext} from "@automerge/react";
import {Entry} from "../src/Model/Entry";
import {AutomergeFacade} from "../src/Utility/AutomergeFacade";
import {usePasswordViewModel} from "../src/Components/ViewModels/PasswordViewModel";
import {useHistoryItemViewModel} from "../src/Components/ViewModels/Dialog/HistoryItemViewModel";
import {Folder} from "../src/Model/Folder";

describe("Entry modification Integrationtests", () => {

        it('⟨T 102⟩: Single Entry Lifecycle', async () => {
            // --- 1. SETUP & LOGIN ---
            const passwordManagerHook = renderHook(() => usePasswordManagerViewModel());
            const { repo, securityProvider } = passwordManagerHook.result.current;

            const loginVM = renderHook(() => useLoginViewModel(
                repo,
                passwordManagerHook.result.current.setLoggedIn,
                passwordManagerHook.result.current.setAutomergeFacade,
                securityProvider,
                passwordManagerHook.result.current.setOpenedDatabaseName
            ));

            await act(async () => {
                loginVM.result.current.createDatabase("TestDB", "password123");
            });

            await waitFor(() => expect(passwordManagerHook.result.current.loggedIn).toBe(true));

            const facade = passwordManagerHook.result.current.getAutomergeFacade()!;
            const wrapper = ({ children }: { children: React.ReactNode }) => (
            // @ts-ignore
                <RepoContext.Provider value={repo}>{children}</RepoContext.Provider>
            );

            const passwordVM = renderHook(() => usePasswordViewModel(facade), { wrapper });


            const entryData = new Entry("Amazon", "temp-id", new Date(), new Date(), "user123", "secret", "amazon.com", "Note");

            await act(async () => {
                passwordVM.result.current.createEntry(entryData);
            });


            let realId = "";
            await waitFor(() => {
                const root = passwordVM.result.current.getRootFolder() as Folder;
                // Look through the children of the root folder
                const found = root.entries.find(e => e.title === "Amazon");
                expect(found).toBeDefined();
                realId = found!.id;
            }, { timeout: 2000 });


            await act(async () => {
                // You likely have a method like setCurItem or selectItem
                const newEntry = passwordVM.result.current.getRootFolder().getChildById(realId);
                passwordVM.result.current.setCurItem(newEntry);
            });


            await act(async () => {
                passwordVM.result.current.updateItemAttribute(realId, [
                    ["name", "Amazon Updated"],
                    ["username", "new_user"]
                ]);
            });

/*
            await waitFor(() => {
                // Access result.current INSIDE the expect to get the latest render
                expect(passwordVM.result.current.curItem.title).toBe("Amazon Updated");
            }, { timeout: 2000 });
*/
            //FIXME Hier ist schwierig, ans Item zu kommen und gleichzeitig auf das Automergerepo zu warten
        });
})
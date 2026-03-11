import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, render, renderHook, waitFor, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {usePasswordManagerViewModel} from "../src/Components/ViewModels/PasswordManagerViewModel";
import {useLoginViewModel} from "../src/Components/ViewModels/loginViewModel";
import {useHistoryViewModel} from "../src/Components/ViewModels/Dialog/HistoryViewModel";
import {RepoContext} from "@automerge/react";
import {Entry} from "../src/Model/Entry";
import {AutomergeFacade} from "../src/Utility/AutomergeFacade";
import {usePasswordViewModel} from "../src/Components/ViewModels/PasswordViewModel";
import {useHistoryItemViewModel} from "../src/Components/ViewModels/Dialog/HistoryItemViewModel";
import {Folder} from "../src/Model/Folder";
// @ts-ignore
import EntryView from "../src/Components/Views/EntryView";

describe("Entry modification Integrationtests", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined),
            },
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should test the functionality of entries', async () => {
        const passwordManagerHook = renderHook(() => usePasswordManagerViewModel());
        const {repo, securityProvider} = passwordManagerHook.result.current;

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
        const wrapper = ({children}: { children: React.ReactNode }) => (
            // @ts-ignore
            <RepoContext.Provider value={repo}>{children}</RepoContext.Provider>
        );

        const passwordVM = renderHook(() => usePasswordViewModel(facade), {wrapper});


        const entryData = new Entry("entry1", "temp-id", new Date(), new Date(), "user123", "secret", "amazon.com", "Note");

        await act(async () => {
            passwordVM.result.current.createEntry(entryData);
        });
        let found1;
        await waitFor(() => {
            const root = passwordVM.result.current.getRootFolder();
            found1 = root.items.find(e => e.title === "entry1");
            expect(found1).toBeDefined();
        }, {timeout: 2000});

        //editing
        await act(async () => {
            passwordVM.result.current.updateItemTitle(found1.id, "updatedEntry1");
        });
        await waitFor(() => {
            const root = passwordVM.result.current.getRootFolder();
            found1 = root.items.find(e => e.title === "updatedEntry1");
            expect(found1).toBeDefined();
            expect(passwordVM.result.current.curItem.id).toBe(found1.id);
        });

        await act(async () => {
            passwordVM.result.current.updateItemAttribute(found1.id, [["username", "updatedUser123"], ["password", "secret1"], ["url", "www.abc.de"], ["note", "taking notes"]]);
        });
        await waitFor(() => {
            const root = passwordVM.result.current.getRootFolder();
            found1 = root.items.find(e => e.title === "updatedEntry1") as Entry;
            expect(found1).toBeDefined();
            expect(found1.username).toBe("updatedUser123");
            expect(found1.password).toBe("secret1");
            expect(found1.url).toBe("www.abc.de");
            expect(found1.note).toBe("taking notes");
        })

        // copy to clipboard
        await act(async () => {
            passwordVM.result.current.copyToClipboardAndClear(found1.title);
        });
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("updatedEntry1");
        await act(async () => {
            passwordVM.result.current.copyToClipboardAndClear(found1.username);
        });
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("updatedUser123");
        await act(async () => {
            passwordVM.result.current.copyToClipboardAndClear(found1.password);
        });
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("secret1");
        await act(async () => {
            passwordVM.result.current.copyToClipboardAndClear(found1.url);
        });
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("www.abc.de");
        await act(async () => {
            passwordVM.result.current.copyToClipboardAndClear(found1.note);
        });
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("taking notes");

        //test hide password
        // @ts-ignore
        render(<EntryView item={found1}
                          deleteItem={passwordVM.result.current.deleteItem}
                          copyAndClearClipboard={passwordVM.result.current.copyToClipboardAndClear}
                          setEditableView={passwordVM.result.current.setInEditable}
                          hidePassword={passwordVM.result.current.hidePassword}
                          toggleHidePassword={passwordVM.result.current.toggleHidePassword}/>);

        expect(screen.getByText("●●●●●●●●")).toBeDefined();
        expect(screen.queryByText("secret1")).toBeNull();

        let eyeButton = screen.getByTitle("Passwort anzeigen");
        expect(eyeButton).toBeDefined();
        await userEvent.click(eyeButton);
        expect(screen.queryByTitle("Passwort anzeigen")).toBeNull();
        expect(screen.queryByText("●●●●●●●●")).toBeNull();
        expect(screen.getByText("secret1")).toBeDefined();

        eyeButton = screen.getByTitle("Passwort verstecken");
        expect(eyeButton).toBeDefined();
        await userEvent.click(eyeButton);
        expect(screen.getByText("●●●●●●●●")).toBeDefined();
        expect(screen.queryByText("secret1")).toBeNull();
    });
})
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, render, renderHook, waitFor, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {usePasswordManagerViewModel} from "../src/Components/ViewModels/PasswordManagerViewModel";
import {useLoginViewModel} from "../src/Components/ViewModels/loginViewModel";
import {RepoContext} from "@automerge/react";
import {Entry} from "../src/Model/Entry";
import {usePasswordViewModel} from "../src/Components/ViewModels/PasswordViewModel";
// @ts-ignore
import EntryView from "../src/Components/Views/EntryView";
import {usePasswordGenViewModel} from "../src/Components/ViewModels/Dialog/PasswordGenViewModel";
import {useEditablePasswordViewModel} from "../src/Components/ViewModels/EditablePasswordViewModel";

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

        const passwordVM = renderHook(() => usePasswordViewModel(facade, [], false), {wrapper});


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

        // create entry view to test if the password is shon correctly
        // @ts-ignore
        const {rerender} = render(<EntryView item={found1}
                          deleteItem={passwordVM.result.current.deleteItem}
                          copyAndClearClipboard={passwordVM.result.current.copyToClipboardAndClear}
                          setEditableView={passwordVM.result.current.setInEditable}
                          hidePassword={passwordVM.result.current.hidePassword}
                          toggleHidePassword={passwordVM.result.current.toggleHidePassword}/>);

        expect(screen.getByText("●●●●●●●●")).toBeDefined();
        expect(screen.queryByText("secret1")).toBeNull();

        let eyeButton = screen.getByTitle("Passwort anzeigen");
        expect(eyeButton).toBeDefined();

        await act(async () => {
            await userEvent.click(eyeButton);
        });

        // @ts-ignore
        rerender(<EntryView item={found1}
                       deleteItem={passwordVM.result.current.deleteItem}
                       copyAndClearClipboard={passwordVM.result.current.copyToClipboardAndClear}
                       setEditableView={passwordVM.result.current.setInEditable}
                       hidePassword={passwordVM.result.current.hidePassword}
                       toggleHidePassword={passwordVM.result.current.toggleHidePassword}
            />);

        expect(await screen.findByText("secret1")).toBeDefined();
        expect(screen.queryByText("●●●●●●●●")).toBeNull();

        eyeButton = screen.getByTitle("Passwort verstecken");
        expect(eyeButton).toBeDefined();

        await act(async () => {
            await userEvent.click(eyeButton);
        });

        // @ts-ignore
        rerender(<EntryView item={found1}
                            deleteItem={passwordVM.result.current.deleteItem}
                            copyAndClearClipboard={passwordVM.result.current.copyToClipboardAndClear}
                            setEditableView={passwordVM.result.current.setInEditable}
                            hidePassword={passwordVM.result.current.hidePassword}
                            toggleHidePassword={passwordVM.result.current.toggleHidePassword}
        />);

        expect(screen.getByText("●●●●●●●●")).toBeDefined();
        expect(screen.queryByText("secret1")).toBeNull();


        // generate password
        const editableEntryViewVM = renderHook(() => useEditablePasswordViewModel(
            found1, passwordVM.result.current.updateItemAttribute, vi.fn(),false, vi.fn(),vi.fn()
        ), {wrapper});
        const generatorVM = renderHook(() => usePasswordGenViewModel(editableEntryViewVM.result.current.setPassword), {wrapper});

        await act(async () => {
            generatorVM.result.current.setLength("37");
        })
        await act(async () => {
            generatorVM.result.current.handleConfirm();
        })

        expect(editableEntryViewVM.result.current.password).toHaveLength(37);
        expect(editableEntryViewVM.result.current.password).not.toBe("secret1");

        await act(async () => {
            editableEntryViewVM.result.current.saveEntry();
        })

        await waitFor(() => {
            const root = passwordVM.result.current.getRootFolder();
            found1 = root.items.find(e => e.title === "updatedEntry1");
            expect(found1).toBeDefined();
        });

        // @ts-ignore
        rerender(<EntryView item={found1}
                            deleteItem={passwordVM.result.current.deleteItem}
                            copyAndClearClipboard={passwordVM.result.current.copyToClipboardAndClear}
                            setEditableView={passwordVM.result.current.setInEditable}
                            hidePassword={passwordVM.result.current.hidePassword}
                            toggleHidePassword={passwordVM.result.current.toggleHidePassword}
        />);

        eyeButton = screen.getByTitle("Passwort anzeigen");
        expect(eyeButton).toBeDefined();

        await act(async () => {
            await userEvent.click(eyeButton);
        });

        // @ts-ignore
        rerender(<EntryView item={found1}
                            deleteItem={passwordVM.result.current.deleteItem}
                            copyAndClearClipboard={passwordVM.result.current.copyToClipboardAndClear}
                            setEditableView={passwordVM.result.current.setInEditable}
                            hidePassword={passwordVM.result.current.hidePassword}
                            toggleHidePassword={passwordVM.result.current.toggleHidePassword}
        />);

        expect(screen.queryByText("secret1")).toBeNull();
        expect(screen.getByText(editableEntryViewVM.result.current.password)).toBeDefined();


        // delete entry
        await act(async () => {
            passwordVM.result.current.confirmDeletion(found1);
        })
        expect(passwordVM.result.current.getRootFolder().items.find(e => e.title === "updatedEntry1")).toBeUndefined();
    });
})
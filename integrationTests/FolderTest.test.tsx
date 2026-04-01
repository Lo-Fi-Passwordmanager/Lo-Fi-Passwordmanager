import {describe, expect, it} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {usePasswordManagerViewModel} from "../src/Components/ViewModels/PasswordManagerViewModel";
import {useLoginViewModel} from "../src/Components/ViewModels/loginViewModel";
import {RepoContext} from "@automerge/react";
import {SortCriteria, usePasswordViewModel} from "../src/Components/ViewModels/PasswordViewModel";
import {useListViewModel} from "../src/Components/ViewModels/ListViewModel";
import {Folder} from "../src/Model/Folder";
import {Item} from "../src/Model/Item";
import {Entry} from "../src/Model/Entry";
import {DragEndEvent} from "@dnd-kit/core";
import {useFilteredListViewModel} from "../src/Components/ViewModels/FilteredListViewModel";

describe("FolderTest", () => {

    it('should test the funcionality of folders', async () => {
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

        // Create folders and rename them
        const folderData1 = new Folder("Folder 1", "temp-id", new Date(), new Date());
        const folderData2 = new Folder("Folder 2", "temp-id", new Date(), new Date());


        await act(async () => {
            passwordVM.result.current.addItem(folderData1);
        });
        await act(async () => {
            passwordVM.result.current.addItem(folderData2);
        });
        expect(passwordVM.result.current.getRootFolder().items.length).toBe(2);
        let found1: Item;
        let found2: Item;
        await waitFor(() => {
            const root = passwordVM.result.current.getRootFolder() as Folder;
            // Look through the children of the root folder
            found1 = root.items.find(e => e.title === "Folder 1");
            expect(found1).toBeDefined();
            found2 = root.items.find(e => e.title === "Folder 2");
            expect(found2).toBeDefined();
        }, {timeout: 2000});

        act(() => {
            passwordVM.result.current.updateItemTitle(found1.id, "Renamed Folder 1");
        });
        act(() => {
            passwordVM.result.current.updateItemTitle(found2.id, "Renamed Folder 2");
        });

        await waitFor(() => {
            const root = passwordVM.result.current.getRootFolder() as Folder;
            // Look through the children of the root folder
            found1 = root.items.find(e => e.title === "Renamed Folder 1");
            expect(found1).toBeDefined();
            found2 = root.items.find(e => e.title === "Renamed Folder 2");
            expect(found2).toBeDefined();
        }, {timeout: 2000});

        // Create entries and move them into folders
        const entryData2 = new Entry("Entry 2", "temp-id", new Date(), new Date(), "username2", "secret2", "url2", "note2");
        const entryData1 = new Entry("Entry 1", "temp-id", new Date(), new Date(), "username1", "secret1", "url1", "note1");

        await act(async () => {
            passwordVM.result.current.createEntry(entryData1);
        });
        await waitFor(() => {
            passwordVM.result.current.createEntry(entryData2);
        });

        const mockDrangEndEvent1 = {
            over: {id: found1.id},
            active: {id: entryData1.id}
        } as unknown as DragEndEvent;

        const mockDrangEndEvent2 = {
            over: {id: found1.id},
            active: {id: entryData2.id}
        } as unknown as DragEndEvent;

        const mockDrangEndEvent3 = {
            over: {id: found2.id},
            active: {id: found1.id}
        } as unknown as DragEndEvent;

        await act(async () => {
            passwordVM.result.current.handleDragEnd(mockDrangEndEvent1);
        });

        await act(async () => {
            passwordVM.result.current.handleDragEnd(mockDrangEndEvent2);
        });

        await waitFor(() => {
            passwordVM.result.current.handleDragEnd(mockDrangEndEvent3);
        })

        let root;
        let folder1;
        let folder2;
        await waitFor(() => {
            root = passwordVM.result.current.getRootFolder() as Folder;
            expect(root.items.length).toBe(1);
            folder2 = root.items.find(e => e.title === "Renamed Folder 2") as Folder;
            folder1 = folder2.items.find(e => e.title === "Renamed Folder 1") as Folder;
            expect(folder1).toBeDefined();
            expect(folder2).toBeDefined();
            expect(folder1.items.length).toBe(2);
            expect(folder1.items.some(e => e.title === "Entry 1")).toBe(true);
            expect(folder1.items.some(e => e.title === "Entry 2")).toBe(true);
        }, {timeout: 2000});

        expect(passwordVM.result.current.isFolderExpanded(folder2.id)).toBe(true);
        expect(passwordVM.result.current.isFolderExpanded(folder1.id)).toBe(true);

        // Navigate through folders
        act(() => {
            passwordVM.result.current.collapseFolder(folder2.id);
        });
        act(() => {
            passwordVM.result.current.collapseFolder(folder1.id);
        });
        expect(passwordVM.result.current.isFolderExpanded(folder2.id)).toBe(false);
        expect(passwordVM.result.current.isFolderExpanded(folder1.id)).toBe(false);
        act(() => {
            passwordVM.result.current.expandFolder(folder2.id);
        });
        act(() => {
            passwordVM.result.current.expandFolder(folder1.id);
        });
        expect(passwordVM.result.current.isFolderExpanded(folder2.id)).toBe(true);
        expect(passwordVM.result.current.isFolderExpanded(folder1.id)).toBe(true);
        act(() => {
            passwordVM.result.current.collapseFolder(folder2.id);
        });
        expect(passwordVM.result.current.isFolderExpanded(folder2.id)).toBe(false);
        expect(passwordVM.result.current.isFolderExpanded(folder1.id)).toBe(true);

        // Test sorting
        const entryData3 = new Entry("3Entry", "temp-id", new Date(), new Date(), "username3", "secret3", "url3", "note3");
        const entryData4 = new Entry("Z-Entry", "temp-id", new Date(), new Date(), "username4", "secret4", "url4", "note4");

        await act(async () => {
            passwordVM.result.current.createEntry(entryData3);
        });
        await act(async () => {
            passwordVM.result.current.createEntry(entryData4);
        });

        let sortedItems = passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder());
        expect(sortedItems[0].title).toBe("3Entry");
        expect(sortedItems[1].title).toBe("Renamed Folder 2");
        expect(sortedItems[2].title).toBe("Z-Entry");

        act(() => {
            passwordVM.result.current.setIsAscending(false);
        });
        sortedItems = passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder());
        expect(sortedItems[0].title).toBe("Z-Entry");
        expect(sortedItems[1].title).toBe("Renamed Folder 2");
        expect(sortedItems[2].title).toBe("3Entry");

        act(() => {
            passwordVM.result.current.setCurSortCrit(SortCriteria.CreatedAt);
            passwordVM.result.current.setIsAscending(true);
        });
        sortedItems = passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder());
        expect(passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder())[0].title).toBe("Renamed Folder 2");
        expect(passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder())[1].title).toBe("3Entry");
        expect(passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder())[2].title).toBe("Z-Entry");

        const entry3 = passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder())[1];
        act(() => {
            passwordVM.result.current.updateItemAttribute(entry3.id, [["username", "updated_user123"]]);
        });
        act(() => {
            passwordVM.result.current.setCurSortCrit(SortCriteria.EditedAt);
            passwordVM.result.current.setIsAscending(false);
        });
        sortedItems = passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder());
        expect(passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder())[0].title).toBe("3Entry");
        expect(passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder())[1].title).toBe("Z-Entry");
        expect(passwordVM.result.current.getSortedChildren(passwordVM.result.current.getRootFolder())[2].title).toBe("Renamed Folder 2");

        // Test search function
        const filteredListVM = renderHook(() => useFilteredListViewModel(
            passwordVM.result.current.getRootFolder(),
            "2",
            passwordVM.result.current.getSortedChildren
        ), {wrapper});


        const filteredEntries = filteredListVM.result.current.getFilteredEntries();
        const filteredFolders = filteredListVM.result.current.getFilteredFolders();

        expect(filteredEntries.length).toBe(2);
        expect(filteredEntries[0].title).toBe("3Entry"); // username
        expect(filteredEntries[1].title).toBe("Entry 2");
        expect(filteredFolders.length).toBe(1);
        expect(filteredFolders[0].title).toBe("Renamed Folder 2");

        // test deleting folders
        expect((folder2 as Folder).items.some(e => e.title === "Renamed Folder 1")).toBe(true);
        await act(async () => {
            passwordVM.result.current.confirmDeletion(folder1);
        });
        await waitFor(() => {
            folder2 = passwordVM.result.current.getRootFolder().items.find(e => e.title === "Renamed Folder 2") as Folder;
        })
        expect(passwordVM.result.current.getSortedChildren(folder2).some(e => e.title === "Renamed Folder 1")).toBe(false);
        await act(async () => {
            passwordVM.result.current.confirmDeletion(folder2);
        })
        await waitFor(() => {
            root = passwordVM.result.current.getRootFolder();
        })
        expect((root as Folder).items.some(e => e.title === "Renamed Folder 2")).toBe(false);
        expect((root as Folder).items.length).toBe(2);
    })
})
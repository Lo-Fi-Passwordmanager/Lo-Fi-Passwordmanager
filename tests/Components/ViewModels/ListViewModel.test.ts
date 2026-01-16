import {describe, it, expect, beforeEach, afterEach} from "vitest";
import {useListViewModel} from "../../../src/Components/ViewModels/ListViewModel";
import {Folder} from "../../../src/Model/Folder";
import {Entry} from "../../../src/Model/Entry";

describe('ListViewModel', ()=> {
    let listViewModel;

    const root = new Folder("krasser Titel", "123", new Date(), new Date())
    const subFolder1 = new Folder("subFolder 1", "123", new Date(), new Date())
    const subFolder2 = new Folder("subFolder 2", "123", new Date(), new Date())
    const subFolder3 = new Folder("subFolder 2", "123", new Date(), new Date())
    const subFolder4 = new Folder("subFolder 2", "123", new Date(), new Date())
    const subFolder5 = new Folder("subFolder 2", "123", new Date(), new Date())
    const subFolder6 = new Folder("subFolder 2", "123", new Date(), new Date())
    const subFolder7 = new Folder("subFolder 2", "123", new Date(), new Date())
    const entry = new Entry("Name1", "id123", new Date(), new Date(), "benutzer1", "password", "url", "note");
    const entry3 = new Entry("Name3", "id123", new Date(), new Date(), "benutzer1", "password", "url", "note");
    const entry2 = new Entry("Name2", "id234", new Date(), new Date(), "name2", "password", "url", "note");
    const entry4 = new Entry("subentry1", "id234", new Date(), new Date(), "name2", "password", "url", "note");
    const entry5 = new Entry("subentry2", "id234", new Date(), new Date(), "name2", "password", "url", "note");
    root.addItem(subFolder1);
    subFolder1.addItem(entry4);
    subFolder2.addItem(entry5);
    subFolder1.addItem(subFolder2);
    root.addItem(entry);
    root.addItem(entry2);
    root.addItem(entry3);
    subFolder2.addItem(subFolder3);
    subFolder3.addItem(subFolder4);
    subFolder4.addItem(subFolder5);
    subFolder5.addItem(subFolder6);
    subFolder6.addItem(subFolder7);

    beforeEach(()=> {
        listViewModel = useListViewModel(root);
    })

    afterEach(()=> {

    })

    it('should be able to return itself', ()=> {
        console.log(listViewModel.getItem);
        expect(listViewModel.getItem).toStrictEqual(root);
    })
})
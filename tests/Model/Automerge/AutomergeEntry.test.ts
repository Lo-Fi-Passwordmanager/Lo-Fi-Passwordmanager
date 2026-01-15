import {describe, it, beforeEach, expect} from "vitest";
import {AutomergeEntry} from "../../../src/Model/Automerge/AutomergeEntry";

describe('AutomergeEntry',() => {
    let item;

    beforeEach(()=> {
        item = new AutomergeEntry("name", 2020, 2021, "id", "user", "password", "url", "note");
    })

    it('should be created correctly', ()=> {
        expect(item).toBeInstanceOf(AutomergeEntry);
        expect(item.name).toBe("name");
        expect(item.createdAt).toBe(2020);
        expect(item.editedAt).toBe(2021);
        expect(item.parentId).toBe("id");
    })

    it('should be able to get/set a username',()=> {
        expect(item.username).toBe("user");
        item.username = "newUser";
        expect(item.username).toBe("newUser");
    })

    it('should be able to get/set a password',()=> {
        expect(item.password).toBe("password");
        item.password = "newPassword";
        expect(item.password).toBe("newPassword");
    })

    it('should be able to get/set an Url',()=> {
        expect(item.url).toBe("url");
        item.url = "newUrl";
        expect(item.url).toBe("newUrl");
    })

    it('should be able to get/set a Note',()=> {
        expect(item.note).toBe("note");
        item.note = "newNote";
        expect(item.note).toBe("newNote");
    })
})
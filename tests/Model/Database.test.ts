import {beforeEach, describe, expect, it} from "vitest";
import Database from "../../src/Model/Database";

describe('Database', () => {
    let database;

    beforeEach(()=> {
        database = new Database("id", "name");
    })

    it('should be able to return its name', ()=> {
        expect(database.Name).toBe("name");
    })

    it('should be able to return its id', ()=> {
        expect(database.Id).toBe("id");
    })
})
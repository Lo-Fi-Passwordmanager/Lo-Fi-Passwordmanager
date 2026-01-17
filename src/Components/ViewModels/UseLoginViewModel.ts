import {useEffect, useState} from 'react';
import Database from '../../Model/Database';
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";
import {loadAllDatabases} from "./PasswordManagerViewModel.ts";
import type {Repo} from "@automerge/react";
import {AutomergeFacade, useAutomergeFacade} from "../../Utility/AutomergeFacade.ts";

export type LoginViewModelReturn = {
    databaseNames: string[],
    openedDatabase: Database | null,
    isAddDialogOpen: boolean,
    isOpenDialogOpen: boolean,
    createDatabase: (name: string, masterPassword: string) => void,
    tryOpenDatabase: (masterPassword: string) => void,
    closeDatabase: () => void,
    openAddDialog: () => void,
    closeAddDialog: () => void,
    openOpenDialog: (db: string) => void,
    closeOpenDialog: () => void
}

/**
 * ViewModel for the LoginView
 * @param repo the automerge repo
 * @returns all data and functions required by the LoginView
 * @author uwing
 */
export const useLoginViewModel = (repo: Repo): LoginViewModelReturn => {
    // map of database names to their automerge urls
    const [databases, setDatabases] = useState(() => loadAllDatabases());
    // names of all available databases to show in the listing
    const [databaseNames, setDatabaseNames] = useState<string[]>([]);

    // currently opened database
    const [openedDatabase, setOpenedDatabase] = useState<Database | null>(null);
    // database that was clicked to be opened
    const [clickedDatabase, setClickedDatabase] = useState<string | null>(null);
    // whether the dialog to add a new database is open
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    // whether the dialog to open a database is open
    const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false);

    const securityProvider = new SecurityProvider();

    // update the list of database names when the databases change
    useEffect(() => {
        setDatabaseNames(Array.from(databases.keys()));
    }, [databases]);

    // creates a new database with the provided name and master password
    const createDatabase = (name: string, masterPassword: string) => {
        const salt = securityProvider.getNewSalt();
        const validation = securityProvider.getNewValidation(masterPassword, salt);

        const facade = new AutomergeFacade(repo);
        facade.createDatabase(salt, validation, name)

        const url = facade.automergeURL!;

        setDatabases(prev => {
            const copy = new Map(prev);
            copy.set(name, url);
            return copy;
        });
        setIsAddDialogOpen(false);

        setClickedDatabase(name);
        setIsOpenDialogOpen(true);
    }

    // tries to open a database with the provided master password
    const tryOpenDatabase = async (masterPassword: string) => {
        const name = clickedDatabase;
        if (!name) {
            throw new Error("No database selected");
        }
        const dbUrl = databases.get(name);

        if (!dbUrl) {
            throw new Error("Database doesn't exist");
        }

        const facade = new AutomergeFacade(repo, dbUrl)
        if (securityProvider.verifyMasterPassword(masterPassword, await facade.getSalt()!, await facade.getValidation()!)) {
            const db = new Database(dbUrl, name);
            setOpenedDatabase(db);
            setIsOpenDialogOpen(false);
            setClickedDatabase(null);
        } else {
            alert("Falsches Masterpasswort!");
        }
    }

    // close the currently opened database
    const closeDatabase = () => {
        setOpenedDatabase(null);
    };

    // Open the dialog to create a new database
    const openAddDialog = () => setIsAddDialogOpen(true);
    // Close the dialog to create a new database
    const closeAddDialog = () => setIsAddDialogOpen(false);

    // Open the dialog to login to a database
    const openOpenDialog = (db: string) => {
        setClickedDatabase(db);
        setIsOpenDialogOpen(true);
    }
    // Close the dialog to login to a database
    const closeOpenDialog = () => setIsOpenDialogOpen(false);

    return {
        databaseNames,
        openedDatabase,
        isAddDialogOpen,
        isOpenDialogOpen,

        createDatabase,
        tryOpenDatabase,
        closeDatabase,
        openAddDialog,
        closeAddDialog,
        openOpenDialog,
        closeOpenDialog
    };
}
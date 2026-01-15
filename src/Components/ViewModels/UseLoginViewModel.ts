import {useEffect, useState} from 'react';
import Database from '../../Model/Database';
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";
import {loadAllDatabases} from "./PasswordManagerViewModel.ts";
import type {Repo} from "@automerge/react";
import {useAutomergeFacade} from "../../Utility/AutomergeFacade.ts";

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


export const useLoginViewModel = (repo: Repo): LoginViewModelReturn => {
    const [databases, setDatabases] = useState(() => loadAllDatabases());
    const [databaseNames, setDatabaseNames] = useState<string[]>([]);

    const [openedDatabase, setOpenedDatabase] = useState<Database | null>(null);
    const [clickedDatabase, setClickedDatabase] = useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false);

    useEffect(() => {
        setDatabaseNames(Array.from(databases.keys()));
    }, [databases]);

    // creates a new database with the provided name and master password
    const createDatabase = (name: string, masterPassword: string) => {
        const sec = new SecurityProvider();
        const salt = sec.getNewSalt();
        const validation = sec.getNewValidation(masterPassword, salt);

        const facade = useAutomergeFacade(repo, undefined, salt, validation, name);

        const url = facade.automergeURL;

        setDatabases(databases.set(name, url));
        setIsAddDialogOpen(false);

        setClickedDatabase(name);
        setIsOpenDialogOpen(true);
    }

    // tries to open a database with the provided master password
    const tryOpenDatabase = (masterPassword: string) => {
        debugger;
        const name = clickedDatabase;
        if (!name) {
            throw new Error("No database selected");
        }
        const dbUrl = databases.get(name);
        if (!dbUrl) {
            throw new Error("Database doesn't exist");
        }

        const facade = useAutomergeFacade(repo, dbUrl);
        const sec = new SecurityProvider();
        if (sec.verifyMasterPassword(masterPassword, facade.salt!, facade.validation!)) {
            const db = new Database(dbUrl, name, facade.tree);
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
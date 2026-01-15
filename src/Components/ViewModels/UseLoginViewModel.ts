import {useState} from 'react';
import Database from '../../Model/Database';
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";
import {useAutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {loadAllDatabases} from "./PasswordManagerViewModel.ts";
import type {Repo} from "@automerge/react";

export type LoginViewModelReturn = {
    databaseNames: string[],
    openedDatabase: Database | null,
    isAddDialogOpen: boolean,
    isOpenDialogOpen: boolean,
    createDatabase: (name: string, masterPassword: string) => void,
    openDatabase: (database: Database) => void,
    tryOpenDatabase: (masterPassword: string) => boolean,
    closeDatabase: () => void,
    openAddDialog: () => void,
    closeAddDialog: () => void,
    openOpenDialog: (db: string) => void,
    closeOpenDialog: () => void
}


export const useLoginViewModel = (repo: Repo): LoginViewModelReturn => {
    const [databases, setDatabases] = useState(() => loadAllDatabases());
    const databaseNames = Array.from(databases.keys());

    const [openedDatabase, setOpenedDatabase] = useState<Database | null>(null);
    const [clickedDatabase, setClickedDatabase] = useState<Database | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false);

    // creates a new database with the provided name and master password
    const createDatabase = (name: string, masterPassword: string) => {
        const sec = new SecurityProvider();
        const salt = sec.getNewSalt();
        const validation = sec.getNewValidation(masterPassword, salt)

        const facade = useAutomergeFacade(repo, undefined, salt, validation, masterPassword);

        const url = facade.automergeURL;
        const root = facade.tree;

        setClickedDatabase(new Database(url, name, root));
        setIsOpenDialogOpen(true);
    }

    // tries to open a database with the provided master password
    const tryOpenDatabase = (databaseKey: string, masterPassword: string): boolean => {
        if (!clickedDatabase) {
            return false;
        }
        const automergeURL = databases.get(clickedDatabase);
    }

    // opens a database
    const openDatabase = (database: Database) => {
        setClickedDatabase(null);
        //   database.setRoot(buildDatabaseAsTree(database.getRootDoc()));
        setOpenedDatabase(database);
    };

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
        openDatabase,
        tryOpenDatabase,
        closeDatabase,
        openAddDialog,
        closeAddDialog,
        openOpenDialog,
        closeOpenDialog
    };
}
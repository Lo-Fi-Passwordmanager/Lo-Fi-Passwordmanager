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
    isEnterPasswordDialogOpen: boolean,
    createDatabase: (name: string, masterPassword: string) => void,
    tryOpenDatabase: (masterPassword: string) => void,
    closeDatabase: () => void,
    openAddDialog: () => void,
    closeAddDialog: () => void,
    openEnterPasswordDialog: (db: string) => void,
    closeEnterPasswordDialog: () => void
}

/**
 * ViewModel for the LoginView
 * @param repo the automerge repo
 * @param setLoggedIn the function to update the View to switch from loginView to PasswordView
 * @param setAutomergeFacade the function to update the automergeFacade of the used database on correct Login
 * @returns all data and functions required by the LoginView
 * @author uwing
 */
export const useLoginViewModel = (
    repo: Repo, setLoggedIn?: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setAutomergeFacade?: (value: (((prevState: (AutomergeFacade | null)) => (AutomergeFacade | null)) | AutomergeFacade | null)) => void
): LoginViewModelReturn => {
    // map of database names to their automerge urls
    const [databases, setDatabases] = useState(() => loadAllDatabases());
    // names of all available databases to show in the listing
    const [databaseNames, setDatabaseNames] = useState<string[]>([]);

    // currently opened database
    const [openedDatabase, setOpenedDatabase] = useState<Database | null>(null);
    // database that was clicked to be opened
    const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
    // whether the dialog to add a new database is open
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    // whether the dialog to open a database is open
    const [isEnterPasswordDialogOpen, setIsEnterPasswordDialogOpen] = useState(false);

    const securityProvider = new SecurityProvider();

    // update the list of database names when the databases change
    useEffect(() => {
        setDatabaseNames(Array.from(databases.keys()));
    }, [databases]);

    /**
     * creates a new database with the provided name and master password
     * @param name the name of the database
     * @param masterPassword the masterpassword that gets used for encryption
     */
    const createDatabase = (name: string, masterPassword: string) => {
        const salt = securityProvider.getNewSalt();
        const validation = securityProvider.getNewValidation(masterPassword, salt);

        const automergeFacade = new AutomergeFacade(repo);
        automergeFacade.createDatabase(salt, validation, name)

        const url = automergeFacade.automergeURL!;

        setDatabases(prev => {
            const copy = new Map(prev);
            copy.set(name, url);
            return copy;
        });
        setIsAddDialogOpen(false);

        setSelectedDatabase(name);
        setIsEnterPasswordDialogOpen(true);
    }

    // tries to open a database with the provided master password
    const tryOpenDatabase = async (masterPassword: string) => {
        if (!selectedDatabase) {
            throw new Error("No database selected");
        }
        const dbUrl = databases.get(selectedDatabase);

        if (!dbUrl) {
            throw new Error("Database doesn't exist");
        }

        const facade = new AutomergeFacade(repo, dbUrl)
        if (securityProvider.verifyMasterPassword(masterPassword, (await facade.getSalt())!, (await facade.getValidation())!)) {
            const db = new Database(dbUrl, selectedDatabase);
            setOpenedDatabase(db);
            setLoggedIn!(true);
            setAutomergeFacade!(facade);
            setIsEnterPasswordDialogOpen(false);
            setSelectedDatabase(null);
        } else {
            alert("Falsches Masterpasswort!");
        }
    }

    // close the currently opened database
    const closeDatabase = () => {
        setOpenedDatabase(null);
        setLoggedIn!(false);
    };

    // Open the dialog to create a new database
    const openAddDialog = () => setIsAddDialogOpen(true);
    // Close the dialog to create a new database
    const closeAddDialog = () => setIsAddDialogOpen(false);

    // Open the dialog to login to a database
    const openEnterPasswordDialog = (db: string) => {
        setSelectedDatabase(db);
        setIsEnterPasswordDialogOpen(true);
    }
    // Close the dialog to login to a database
    const closeEnterPasswordDialog = () => setIsEnterPasswordDialogOpen(false);

    return {
        databaseNames,
        openedDatabase,
        isAddDialogOpen,
        isEnterPasswordDialogOpen,

        createDatabase,
        tryOpenDatabase,
        closeDatabase,
        openAddDialog,
        closeAddDialog,
        openEnterPasswordDialog,
        closeEnterPasswordDialog,
    };
}
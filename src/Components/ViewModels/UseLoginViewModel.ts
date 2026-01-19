import {useEffect, useState} from "react";
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";
import type {Repo} from "@automerge/react";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import type {AutomergeUrl} from "@automerge/automerge-repo";
import {loadAllDatabases, storeDatabase} from "../../Utility/Storage.ts";
import {useLoadingScreen} from "./LoadingScreenProviderViewModel.ts";

export type LoginViewModelReturn = {
    databaseNames: string[],
    databases: Map<string, AutomergeUrl>,
    isAddDialogOpen: boolean,
    isEnterPasswordDialogOpen: boolean,
    createDatabase: (name: string, masterPassword: string) => void,
    tryOpenDatabase: (masterPassword: string) => void,
    closeDatabase: () => void,
    openAddDialog: () => void,
    closeAddDialog: () => void,
    openEnterPasswordDialog: (db: string) => void,
    closeEnterPasswordDialog: () => void
    importDatabaseFromURL: (databaseName: string, automergeurl: AutomergeUrl) => void,
    showToast: boolean,
    setShowToast: (showToast: boolean) => void,
    toastMessage: string,
}

/**
 * ViewModel for the LoginView
 * @param repo the automerge repo
 * @param setLoggedIn the function to update the View to switch from loginView to PasswordView
 * @param setAutomergeFacade the function to update the automergeFacade of the used database on correct Login
 * @param passwordViewSecurityProvider
 * @returns all data and functions required by the LoginView
 * @author uwing
 */
export const useLoginViewModel = (
    repo: Repo, setLoggedIn: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setAutomergeFacade: (value: (((prevState: (AutomergeFacade | null)) => (AutomergeFacade | null)) | AutomergeFacade | null)) => void,
    securityProvider: SecurityProvider
): LoginViewModelReturn => {
    // map of database names to their automerge urls
    const [databases, setDatabases] = useState(() => loadAllDatabases());
    // names of all available databases to show in the listing
    const [databaseNames, setDatabaseNames] = useState<string[]>([]);

    // database that was clicked to be opened
    const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
    // whether the dialog to add a new database is open
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    // whether the dialog to open a database is open
    const [isEnterPasswordDialogOpen, setIsEnterPasswordDialogOpen] = useState(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const setLoadingScreenActive = useLoadingScreen();

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
        setLoadingScreenActive(true);
        if (!isNameAvailable(name)) {
            return;
        }

        // Das Timeout an dieser Stelle sorgt dafür, dass der enthaltene Codeblock ans Ende der aktuell auszuführenden Aktionen geschoben wird,
        // wodurch das Rendering des Ladescreens ermöglicht wird, bevor der SecurityProvider den Thread blockiert.
        setTimeout(() => {
            const salt = securityProvider.getNewSalt();
            const validation = securityProvider.getNewValidation(masterPassword, salt);

            const automergeFacade = new AutomergeFacade(repo);
            automergeFacade.createDatabase(salt, validation);

            const url = automergeFacade.automergeURL!;
            addDatabase(name, url);
        }, 0);

        setLoadingScreenActive(false);
    };

    // tries to open a database with the provided master password
    const tryOpenDatabase = async (masterPassword: string) => {
        if (!selectedDatabase) {
            throw new Error("No database selected");
        }
        const dbUrl = databases.get(selectedDatabase);
        if (!dbUrl) {
            throw new Error("Database doesn't exist");
        }

        setLoadingScreenActive(true);

        const facade = new AutomergeFacade(repo, dbUrl, securityProvider);
        const salt = (await facade.getSalt())!;
        const validation = (await facade.getValidation())!;

        // Das Timeout an dieser Stelle sorgt dafür, dass der enthaltene Codeblock ans Ende der aktuell auszuführenden Aktionen geschoben wird,
        // wodurch das Rendering des Ladescreens ermöglicht wird, bevor der SecurityProvider den Thread blockiert.
        setTimeout(() => {
            try {
                if (securityProvider.verifyMasterPassword(masterPassword, salt, validation)) {
                    setLoggedIn!(true);
                    setAutomergeFacade!(facade);
                    setLoadingScreenActive(false);
                    setIsEnterPasswordDialogOpen(false);
                    setSelectedDatabase(null);
                } else {
                    setLoadingScreenActive(false);
                    setShowToast(true);
                    setToastMessage("Falsches Masterpasswort!");
                }
            } catch (error) {
                console.error(error);
                setLoadingScreenActive(false);
                setShowToast(true);
                setToastMessage("Die Datenbank konnte nicht geladen werden");
            }
        }, 0);
    };

    /**
     * Imports a database from an automerge url and stores it in localStorage
     * @param name the name of the database
     * @param automergeurl the automerge url of the database
     */
    function importDatabaseFromURL(name: string, automergeurl: AutomergeUrl) {
        if (!isNameAvailable(name) || !isAutomergeUrlAvailable(automergeurl)) {
            return;
        }
        addDatabase(name, automergeurl);
    }

    /**
     * Adds a new database to the list of available databases and opens the enter password dialog
     * @param name the name of the new database
     * @param url the automerge url of the new database
     */
    function addDatabase(name: string, url: AutomergeUrl) {
        storeDatabase(name, url);
        setDatabases(loadAllDatabases);

        closeAddDialog();

        // TODO, wollen wir die Datenbank hier nicht direkt öffnen? glaube das wäre schöner (wenn die gerade erstellt wurde)

        setSelectedDatabase(name);
        setIsEnterPasswordDialogOpen(true);
    }

    /**
     * Checks if a database name is available
     *
     * @param name the name to check
     */
    function isNameAvailable(name: string): boolean {
        if (databases.has(name)) {
            setShowToast(true);
            setToastMessage("Datenbank mit diesem Namen existiert bereits!");
            return false;
        }
        return true;
    }

    function isAutomergeUrlAvailable(url: AutomergeUrl) {
        for (const value of databases.values()) {
            if (value === url) {
                setShowToast(true);
                setToastMessage("Datenbank mit dieser Url existiert bereits!");
                return false;
            }
        }
        return true;
    }

    // close the currently opened database
    const closeDatabase = () => {
        setLoggedIn!(false);
        securityProvider.clearKey();
    };

    // Open the dialog to create a new database
    const openAddDialog = () => setIsAddDialogOpen(true);
    // Close the dialog to create a new database
    const closeAddDialog = () => setIsAddDialogOpen(false);

    // Open the dialog to login to a database
    const openEnterPasswordDialog = (db: string) => {
        setSelectedDatabase(db);
        setIsEnterPasswordDialogOpen(true);
    };
    // Close the dialog to login to a database
    const closeEnterPasswordDialog = () => setIsEnterPasswordDialogOpen(false);

    return {
        databaseNames,
        isAddDialogOpen,
        isEnterPasswordDialogOpen,
        databases,
        showToast,
        toastMessage,

        setShowToast,
        createDatabase,
        tryOpenDatabase,
        closeDatabase,
        openAddDialog,
        closeAddDialog,
        openEnterPasswordDialog,
        closeEnterPasswordDialog,
        importDatabaseFromURL
    };
};
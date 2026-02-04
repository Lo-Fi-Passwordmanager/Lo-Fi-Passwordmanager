import {useEffect, useState} from "react";
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";
import type {Repo} from "@automerge/react";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import type {AutomergeUrl} from "@automerge/automerge-repo";
import {loadAllDatabases, removeDatabase, renameDatabase, storeDatabase} from "../../Utility/Storage.ts";
import {useLoadingScreen} from "./LoadingScreenProviderViewModel.ts";
import {uInt8ArrayFromFile} from "../../Utility/InputOutputUtil.ts";

/**
 * ViewModel for the LoginView. Provides all data and functions required by the LoginView.
 *
 * @param repo the automerge repo
 * @param setLoggedIn the function to update the View to switch from loginView to PasswordView.
 * @param setAutomergeFacade the function to update the automergeFacade of the used database on correct Login.
 * @param securityProvider the security Provider to encrypt/decrypt with the given master password.
 * @param setOpenedDbName the function that sets the Database name on the PasswordManager.
 *
 * @returns all data and functions required by the LoginView
 */
export const loginViewModel = (
    repo: Repo,
    setLoggedIn: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setAutomergeFacade: (value: (((prevState: (AutomergeFacade | null)) => (AutomergeFacade | null)) | AutomergeFacade | null)) => void,
    securityProvider: SecurityProvider,
    setOpenedDbName: ((value: (((prevState: string) => string) | string)) => void)
) => {
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
    const [databaseToDelete, setDatabaseToDelete] = useState<string | null>(null);
    const [hidePassword, setHidePassword] = useState<boolean>(true);

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
            setLoadingScreenActive(false);
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
            addDatabase(name, url, masterPassword);
        }, 0);
    };

    /**
     * Renames a database from oldName to newName
     *
     * @param oldName the current name of the database
     * @param newName the new name of the database
     */
    function changeDatabaseName(oldName: string, newName: string) {
        if (!isNameAvailable(newName)) {
            return;
        }
        setDatabases(() => renameDatabase(oldName, newName));
    }

    /**
     * Tries to open a database with the provided master password
     *
     * @param masterPassword the master password to decrypt the database
     * @param name optional name of the database if an database was just added
     */
    const tryOpenDatabase = async (masterPassword: string, name?: string) => {
            let dbUrl: AutomergeUrl | undefined;
            if (name) {
                dbUrl = loadAllDatabases().get(name); // react states update asynchronously, so we have to load directly here
            } else if (selectedDatabase) {
                dbUrl = databases.get(selectedDatabase);
            } else {
                throw new Error("No database selected");
            }
            if (!dbUrl) {
                throw new Error("Database doesn't exist");
            }

            setLoadingScreenActive(true);
            setOpenedDbName(selectedDatabase!);
            const facade = new AutomergeFacade(repo, dbUrl, securityProvider);
            let salt: string | null;
            let validation: string | null;
            try {
                salt = (await facade.getSalt());
                validation = (await facade.getValidation());

            } catch (error) {
                console.error(error);
                setLoadingScreenActive(false);
                setShowToast(true);
                setToastMessage("Automerge konnte die Datenbank nicht laden!");
                return;
            }

            if (salt == null || validation == null) {
                setLoadingScreenActive(false);
                setShowToast(true);
                setToastMessage("Automerge konnte die Datenbank nicht laden!");
                return;
            }

            // Das Timeout an dieser Stelle sorgt dafür, dass der enthaltene Codeblock ans Ende der aktuell auszuführenden Aktionen geschoben wird,
            // wodurch das Rendering des Ladescreens ermöglicht wird, bevor der SecurityProvider den Thread blockiert.
            setTimeout(() => {
                try {
                    if (securityProvider.verifyMasterPassword(masterPassword, salt, validation)) {
                        setLoggedIn!(true);
                        setAutomergeFacade!(facade);
                        setLoadingScreenActive(false);
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
        }
    ;

    /**
     * Imports a database from an automerge url and stores it in localStorage
     * @param name the name of the database
     * @param url the automerge url of the database
     */
    function importDatabaseFromURL(name: string, url: AutomergeUrl) {
        if (!isNameAvailable(name) || !isAutomergeUrlAvailable(url)) {
            setLoadingScreenActive(false);
            return;
        }
        addDatabase(name, url);
    }

    /**
     * Adds a new database to the list of available databases and opens the enter password dialog
     * @param name the name of the new database
     * @param url the automerge url of the new database
     * @param masterPassword optional master password to directly open the database after creation
     */
    function addDatabase(name: string, url: AutomergeUrl, masterPassword?: string) {
        closeAddDialog();

        storeDatabase(name, url);
        setDatabases(loadAllDatabases);
        setSelectedDatabase(name);

        if (masterPassword) {
            tryOpenDatabase(masterPassword, name);
        } else {
            repo.find(url);
        }
    }


    /**
     * Initiates the deletion of a database
     *
     * @param name the name of the database to delete
     */
    function deleteDatabase(name: string) {
        setDatabaseToDelete(name);
    }

    /**
     * Confirms the deletion of a database
     *
     * @param name the name of the database to delete
     */
    function confirmDeleteDatabase(name: string) {
        const updatedDatabases = new Map(databases);
        const id = updatedDatabases.get(name)!;
        updatedDatabases.delete(name);
        setDatabases(updatedDatabases);
        removeDatabase(name);
        repo.delete(id);
        setDatabaseToDelete(null);
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

    /**
     * Checks if an automerge url is available or already used
     *
     * @param url the automerge url to check
     */
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

    // Open the dialog to log in to a database
    const openEnterPasswordDialog = (db: string) => {
        setSelectedDatabase(db);
        setIsEnterPasswordDialogOpen(true);
    };
    // Close the dialog to log in to a database
    const closeEnterPasswordDialog = () => setIsEnterPasswordDialogOpen(false);

    /**
     * Imports a database from a file and stores it in localStorage
     *
     * @param targetFiles the file list containing the database file
     * @param name the name of the database
     */
    async function importDatabaseFromFile(targetFiles: FileList | null, name: string) {
        if (!isNameAvailable(name)) {
            return;
        }

        if (name === "") {
            setToastMessage("Bitte wähle einen Namen");
            setShowToast(true);
            return;
        }

        if (!FileList) {
            setToastMessage("Bitte wähle eine Datei");
            setShowToast(true);
            return;
        }

        const binary = await uInt8ArrayFromFile(targetFiles);
        if (!binary) {
            return;
        }

        const handle = repo.import(binary);
        const dbName = name || "Neue Datenbank";
        storeDatabase(dbName, handle.url);
        setSelectedDatabase(dbName);
        setIsAddDialogOpen(false);
        addDatabase(dbName, handle.url);
    }

    /**
     * Toggles the password from ****** to the string and back
     */
    function toggleHidePassword() {
        setHidePassword(!hidePassword);
    }


    return {
        databaseNames,
        isAddDialogOpen,
        isEnterPasswordDialogOpen,
        databases,
        showToast,
        toastMessage,
        databaseToDelete,
        hidePassword,

        importDatabaseFromFile,
        setShowToast,
        createDatabase,
        tryOpenDatabase,
        closeDatabase,
        openAddDialog,
        closeAddDialog,
        openEnterPasswordDialog,
        closeEnterPasswordDialog,
        importDatabaseFromURL,
        setToastMessage,
        deleteDatabase,
        changeDatabaseName,
        confirmDeleteDatabase,
        setDatabaseToDelete,
        toggleHidePassword,
    };
};
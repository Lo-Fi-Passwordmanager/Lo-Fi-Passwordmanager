import {useState, useEffect} from 'react';
//import DatabaseRoot from '../../Model/DatabaseRoot';
import Database from '../../Model/Database';
//import {buildDatabaseAsTree, saveDatabaseFromTree, unlockDatabase} from '../../Utility/AutomergeFacade';
//import SecurityProvider from '../../Utility/Security/SecurityProvider';

export const useLoginViewModel = () => {
    const [databases, setDatabases] = useState<string[]>([]);
    const [openedDatabase, setOpenedDatabase] = useState<Database | null>(null);
    const [clickedDatabase, setClickedDatabase] = useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false);

    useEffect(() => {
        // implement load all databases from storage
    }, []);

    // creates a new database with the provided name and master password
    const createDatabase = (name: string, masterPassword: string) => {

        // implement logic to create a new database here

        setIsAddDialogOpen(false);
    }

    // tries to open a database with the provided master password
    const tryOpenDatabase = (masterPassword: string): boolean => {
        // implement automerge facade unlock here
        return false;
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
        databases,
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
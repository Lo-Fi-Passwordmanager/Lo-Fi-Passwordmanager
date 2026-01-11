import { useState, useEffect } from 'react';
import DatabaseRoot from '../../Model/DatabaseRoot';
import Database from '../../Model/Database';
import {buildDatabaseAsTree, saveDatabaseFromTree, unlockDatabase} from '../../Utility/AutomergeFacade';
import SecurityProvider from '../../Utility/Security/SecurityProvider';

export const LoginViewModel = () => {
    const [databases, setDatabases] = useState<Database[]>([]);
    const [openedDatabase, setOpenedDatabase] = useState<Database | null>(null);
    const [clickedDatabase, setClickedDatabase] = useState<Database | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false);

    useEffect(() => {
        // Load databases from storage or initialize
        const storedDatabases; //= load from storage logic here
        setDatabases(storedDatabases);
    }, []);

    const createDatabase = (name: string, masterPassword: string) => {

        const salt = SecurityProvider.getNewSalt();
        const validationString = SecurityProvider.getNewValidation(masterPassword, salt);
        const newRoot = new DatabaseRoot(salt, validationString);

        const newDatabase = new Database(name, newRoot);
        setDatabases([...databases, newDatabase]);
        saveDatabaseFromTree(newRoot);

        setIsAddDialogOpen(false);
    }

    const tryOpenDatabase = (masterPassword: string): boolean => {
        return unlockDatabase(clickedDatabase.getRootDoc(), masterPassword);
    }

    const openDatabase = (database: Database) => {
        setClickedDatabase(null);
        database.setRoot(buildDatabaseAsTree(database.getRootDoc()));
        setOpenedDatabase(database);
    };

    const closeDatabase = () => {
        setOpenedDatabase(null);
    };

    const openAddDialog = () => setIsAddDialogOpen(true);
    const closeAddDialog = () => setIsAddDialogOpen(false);

    const openOpenDialog = (db: Database) => {
        setClickedDatabase(db);
        setIsOpenDialogOpen(true);
    }
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
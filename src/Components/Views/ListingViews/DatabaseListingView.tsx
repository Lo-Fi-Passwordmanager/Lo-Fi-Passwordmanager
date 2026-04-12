import type {AutomergeUrl} from "@automerge/automerge-repo";
import React from "react";
import {HiTrash} from "react-icons/hi";

import DatabaseListingViewModel from "../../ViewModels/Listing/DatabaseListingViewModel.ts";
import CopyButton from "../ButtonViews/CopyButton.tsx";
import RenameDatabaseDialog from "../DialogViews/RenameDatabaseDialog.tsx";
import ShareDatabaseQRDialog from "../DialogViews/ShareDatabaseQRDialog.tsx";
import {useTranslation} from "react-i18next";

/**
 * View showing a listing of available databases with options to open, share, rename or delete them.
 * @param databases a map of database names to their Automerge URLs
 * @param openDatabase method to open a database by its name
 * @param removeDatabase method to remove a database by its name
 * @param renameDatabase method to rename a database from old name to new name
 */
const DatabaseListingView: React.FC<{
    databases: Map<string, AutomergeUrl>,
    openDatabase: (db: string) => void;
    removeDatabase: (db: string) => void;
    renameDatabase: (oldName: string, newName: string) => void;
}> = ({
          databases,
          openDatabase,
          removeDatabase,
          renameDatabase
      }) => {

    const viewModel = DatabaseListingViewModel();
    const {t} = useTranslation();

    if (databases.size === 0) {
        return <div>{t("login.no_database")}</div>;
    } else {
        return (
            <div className="DatabaseListing">
                {/* List all available Databases which can be opened, shared or deleted */}
                {Array.from(databases).map(([dbName, url]) => (
                    <div className={"DatabaseAndOptions"} key={dbName}>
                        <button
                            onClick={() => openDatabase(dbName)}
                            title={t("login.open")}>
                            {dbName}
                        </button>
                        <CopyButton
                            copyToClipboard={viewModel.copyToClipboard}
                            attributeValue={url}
                            title={t("login.desc.copy_id")}
                            style={{marginLeft: "0"}}
                        />
                        <ShareDatabaseQRDialog name={dbName} url={url}/>
                        <RenameDatabaseDialog oldName={dbName} renameDatabase={renameDatabase}/>
                        <button
                            className={"squareButton"}
                            onClick={() => removeDatabase(dbName)}
                            title={t("login.desc.remove")}>
                            <HiTrash size={24}/>
                        </button>
                    </div>
                ))}
            </div>
        );
    }
};
export default DatabaseListingView;
import React from "react";
import {HiTrash} from "react-icons/hi";
import {HiMiniPlus} from "react-icons/hi2";

import type {SettingsViewModel} from "../../ViewModels/SettingsViewModel.ts";
import SliderCheckBox from "../ButtonViews/SliderCheckBox.tsx";
import AddServerDialog from "../DialogViews/AddServerDialog.tsx";


/**
 * The View that represents the Settings Dialog and Button to open it
 * @param automergeFacade the current AutomergeFacade instance
 * @param openedDbName the name of the currently opened database
 */
const ServerList: React.FC<{
    settingsViewModel: SettingsViewModel
    disabled?: boolean
}> = ({settingsViewModel, disabled}) => {

    const disabledClass = disabled ? "disabled" : "";
    return (
        <>
            <h4>Synchronisationsserver</h4>
            <div className={`scrollableContainer server-list ${disabledClass}`}>
                {Array.from(settingsViewModel.serverStates.keys()).map((server) => (
                    <div className="server-item" key={server}>
                        {!disabled && <SliderCheckBox checked={settingsViewModel.serverStates.get(server)!}
                                                      disabled={settingsViewModel.isLastActiveServer(server)}
                                                      toggleChecked={() => settingsViewModel.toggleSyncServer(server)}/>}
                        <div className="server-name"
                             title={settingsViewModel.serverUrls.get(server) + " | Zum kopieren klicken"}
                             onClick={() => void settingsViewModel.copyToClipboard(settingsViewModel.serverUrls.get(server) ?? "")}>
                            <span>{server}</span>
                        </div>
                        {!disabled && <button
                            className={`squareButton ${settingsViewModel.isLastServer() || settingsViewModel.isLastActiveServer(server) ? "disabled" : ""}`}
                            disabled={settingsViewModel.isLastServer() || settingsViewModel.isLastActiveServer(server)}
                            onClick={() => settingsViewModel.removeSyncServer(server)}
                            title={"Server entfernen"}
                        >
                            <HiTrash size={24}/>
                        </button>}
                    </div>
                ))}
            </div>
            {!disabled && <button
                className="squareButton"
                onClick={() => settingsViewModel.setAddServerDialogOpen(true)}
                style={{alignSelf: "center"}}
            >
                <HiMiniPlus size={24} title={"Sync Server hinzufügen"}/>
            </button>}
            {settingsViewModel.addServerDialogOpen && (
                <AddServerDialog
                    onAddServer={(name, url) => settingsViewModel.addSyncServer(name, url)}
                    onClose={() => settingsViewModel.setAddServerDialogOpen(false)}
                    setShowToast={settingsViewModel.setShowToast}
                    setToastMessage={settingsViewModel.setToastMessage}
                    servers={settingsViewModel.serverUrls}
                />
            )}
        </>
    );
};

export default ServerList;
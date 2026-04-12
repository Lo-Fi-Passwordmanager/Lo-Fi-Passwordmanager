import {useRepo} from "@automerge/automerge-repo-react-hooks";
import {WebSocketClientAdapter} from "@automerge/react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {HiCheckCircle, HiDotsCircleHorizontal, HiTrash} from "react-icons/hi";
import {HiMiniPlus} from "react-icons/hi2";

import type {useSettingsViewModel} from "../../ViewModels/SettingsViewModel.ts";
import SliderCheckBox from "../ButtonViews/SliderCheckBox.tsx";
import AddServerDialog from "../DialogViews/AddServerDialog.tsx";


/**
 * The View for the list of synchronization servers in the settings. It allows the user to add, remove and toggle synchronization servers.
 */
const ServerList: React.FC<{
    settingsViewModel: ReturnType<typeof useSettingsViewModel>,
    disabled?: boolean
}> = ({settingsViewModel, disabled}) => {

    const repo = useRepo();
    const disabledClass = disabled ? "disabled" : "";
    const [connected, setConnected] = useState<string[]>([]);

    const {t} = useTranslation();

    // check if serves are connected
    useEffect(() => {
        const updateConnected = () => {
            const newConnected: string[] = [];

            for (const adapter of repo.networkSubsystem.adapters) {
                if (adapter instanceof WebSocketClientAdapter && adapter.remotePeerId) {
                    newConnected.push(adapter.url);
                }
            }

            setConnected(newConnected);
        };

        updateConnected();

        repo.networkSubsystem.on("peer", updateConnected);
        repo.networkSubsystem.on("peer-disconnected", updateConnected);
        return () => {
            repo.networkSubsystem.off("peer", updateConnected);
            repo.networkSubsystem.off("peer-disconnected", updateConnected);
        };

    }, [repo.networkSubsystem, settingsViewModel.serverStates, settingsViewModel.serverUrls]);
    return (
        <>
            <h4>{t("settings.server.title")}</h4>
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
                        {connected.includes(settingsViewModel.serverUrls.get(server)!) ? <HiCheckCircle
                                title={t("settings.server.desc.connected")}/> :
                            <HiDotsCircleHorizontal title={t("settings.server.desc.connecting")}/>}

                        {!disabled && <button
                            className={`squareButton ${settingsViewModel.isLastServer() || settingsViewModel.isLastActiveServer(server) ? "disabled" : ""}`}
                            disabled={settingsViewModel.isLastServer() || settingsViewModel.isLastActiveServer(server)}
                            onClick={() => settingsViewModel.removeSyncServer(server)}
                            title={t("settings.server.desc.remove")}
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
                title={t("settings.server.desc.add")}
            >
                <HiMiniPlus size={24}/>
            </button>}
            {settingsViewModel.addServerDialogOpen && (
                <AddServerDialog
                    onAddServer={(name, url) => settingsViewModel.addSyncServer(name, url)}
                    onClose={() => settingsViewModel.setAddServerDialogOpen(false)}
                    servers={settingsViewModel.serverUrls}
                />
            )}
        </>
    );
};

export default ServerList;
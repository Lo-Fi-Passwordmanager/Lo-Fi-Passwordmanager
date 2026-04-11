import React from "react";
import {useTranslation} from "react-i18next";
import {HiCheckCircle, HiDotsCircleHorizontal, HiTrash} from "react-icons/hi";
import {HiMiniCog8Tooth, HiMiniMinus, HiMiniPlus} from "react-icons/hi2";

import {type AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";
import CopyButton from "./ButtonViews/CopyButton.tsx";
import SliderCheckBox from "./ButtonViews/SliderCheckBox.tsx";
import DatabaseSettingsView from "./DialogViews/DatabaseSettingsView.tsx";
import Dialog from "./DialogViews/Dialog.tsx";
import GenericQRDialog from "./DialogViews/GenericQRDialog.tsx";
import GenericQRScannerDialog from "./DialogViews/GenericQRScannerDialog.tsx";
import ServerList from "./ListingViews/ServerList.tsx";


/**
 * The View that represents the Settings Dialog and Button to open it
 * @param automergeFacade the current AutomergeFacade instance
 * @param openedDbName the name of the currently opened database
 */
const SettingsView: React.FC<{
    automergeFacade?: AutomergeFacade | null,
    openedDbName?: string,
    closeDatabase?: () => void,
}> = ({automergeFacade, openedDbName, closeDatabase}) => {
    const viewModel = useSettingsViewModel();
    const { i18n, t } = useTranslation();


    if (!viewModel.settingsOpen) {
        return (<>
            <button className="settingsButton" onClick={() => viewModel.setSettingsOpen(true)}
                    title="Einstellungen öffnen">
                <HiMiniCog8Tooth size={24}/>
            </button>
        </>);
    }

    return (
        <Dialog
            title=""
            onCloseDialog={() => viewModel.setSettingsOpen(false)}
            className="settings-dialog"
        >
            <div className="settings-layout">
                {/* Sidebar Navigation */}
                <aside className="settings-sidebar">
                    <h2 style={{alignSelf: "flex-start"}}>{t("settings.title")}</h2>
                    <button className={`settings-tab ${viewModel.activeTab === "general" ? "active" : ""}`}
                            onClick={() => viewModel.setActiveTab("general")}>
                        {t("settings.subsettings.general")}
                    </button>
                    <button className={`settings-tab ${viewModel.activeTab === "database" ? "active" : ""}`}
                            onClick={() => viewModel.setActiveTab("database")}>
                        {t("settings.subsettings.database")}
                    </button>
                    <button className={`settings-tab ${viewModel.activeTab === "about" ? "active" : ""}`}
                            onClick={() => viewModel.setActiveTab("about")}>
                        {t("settings.subsettings.about")}
                    </button>
                </aside>


                {/* Main Content Area */}
                <main className="scrollableContainer settings-content">
                    {viewModel.activeTab === "general" && (
                        <div className="settingsContainer">
                            <h3>{t("settings.subsettings.general")}</h3>

                            <select onChange={viewModel.handleLanguageChange} value={i18n.resolvedLanguage}>
                                <option value='en'>{t("settings.language.english")}</option>
                                <option value='de'>{t("settings.language.german")}</option>
                            </select>

                            <label className="checkboxRow">
                                <SliderCheckBox checked={viewModel.darkMode} toggleChecked={viewModel.toggleDarkMode}/>
                                {t("settings.toggles.dark_mode")}
                            </label>

                            <label className="checkboxRow">
                                <SliderCheckBox checked={viewModel.synchronisation}
                                                toggleChecked={viewModel.toggleSynchronisation}/>
                                {t("settings.toggles.server_sync")}
                            </label>

                            <label className="checkboxRow">
                                <SliderCheckBox checked={viewModel.P2P} toggleChecked={viewModel.toggleP2P}/>
                                {t("settings.toggles.p2p_sync")}
                            </label>

                            <label className="checkboxRow">
                                <SliderCheckBox checked={viewModel.timeOutActive}
                                                toggleChecked={viewModel.toggleTimeOutActive}/>
                                {t("settings.toggles.inactivity")}
                            </label>

                            <label className="checkboxRow">
                                <SliderCheckBox checked={viewModel.recursiveDelete}
                                                toggleChecked={() => viewModel.toggleRecursiveDelete()}/>
                                {t("settings.toggles.recursive_delete")}
                            </label>

                            {viewModel.timeOutActive && (
                                <div className={"timeout-setting"}>
                                    <label>{t("settings.inactivity.title")}</label>
                                    <div className={"numberInput"}>
                                        <input type="number" style={{maxHeight: "2.5rem"}}
                                               value={viewModel.timeoutLength}
                                               onChange={(e) => viewModel.setTimeOutLengthVM(e.target.value)}
                                               min="1"/>
                                        <button className={"squareButton"} style={{boxShadow: "none"}}
                                                onClick={viewModel.decreaseTimeout}
                                                title={"Zeit bis Abmeldung verringern"}><HiMiniMinus size={24}/>
                                        </button>
                                        <button className={"squareButton"} style={{boxShadow: "none"}}
                                                onClick={viewModel.increaseTimeout}
                                                title={"Zeit bis Abmeldung erhöhen"}><HiMiniPlus size={24}/></button>
                                    </div>
                                </div>
                            )}
                            <div className="connection-settings">
                                {!viewModel.synchronisation ? null : (
                                    <ServerList settingsViewModel={viewModel}/>
                                )}


                                {!viewModel.P2P ? null :
                                    <div className={"connection-settings"}>

                                        <h4>{t("settings.p2p.title")}</h4>
                                        <label>{t("settings.p2p.own")}</label>

                                        <div style={{
                                            display: "flex",
                                            marginBottom: "2vh",
                                            gap: "10px",
                                            justifyContent: "space-between",
                                            width: "100%"
                                        }}> {/* for some reason are the styles from the css not applying */}
                                            <label className={"current-server"}>{viewModel.getPeerId()}</label>
                                            <CopyButton
                                                copyToClipboard={viewModel.copyToClipboard}
                                                attributeValue={viewModel.getPeerId()}
                                                style={{marginLeft: "0"}}
                                            />
                                            <GenericQRDialog title={t("settings.p2p.share")}
                                                             qrValue={viewModel.getPeerId()}>
                                                <p>{t("settings.p2p.scan_qr")}</p>
                                            </GenericQRDialog>
                                        </div>
                                        <label>{t("settings.p2p.other_peer")}</label>
                                        <div className={"peer-connection-input"}
                                             style={{
                                                 display: "flex",
                                                 marginBottom: "2vh",
                                                 gap: "10px",
                                                 justifyContent: "space-between",
                                                 width: "100%"
                                             }}> {/* for some reason are the styles from the css not applying */}
                                            <div className={"input-with-qr-container"} style={{position:"relative", width: "100%"}}>
                                                <input type="text"
                                                   value={viewModel.remotePeerId}
                                                   onChange={(e) => viewModel.setRemotePeerId(e.target.value)}
                                                       style={{paddingRight: "40px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}
                                                />
                                                <GenericQRScannerDialog title={"Peer verbinden"}
                                                                        callback={(id: string) => viewModel.connectToPeer(id)}
                                                                        closeScannerOnSuccess
                                                />
                                            </div>
                                            <button
                                                className="rectangle-button"
                                                onClick={() => viewModel.connectToPeer()}
                                                title={"Mit Peer verbinden"}
                                            >
                                                {t("settings.p2p.connect")}
                                            </button>
                                        </div>
                                    </div>
                                }

                                {viewModel.otherPeerMap.size > 0 && viewModel.P2P && (
                                    <>
                                    <span>{t("settings.p2p.connected_peers")}</span>
                                    <div className="scrollableContainer server-list">

                                        {Array.from(viewModel.otherPeerMap.keys()).map((id) => (
                                            <div className="server-item" key={id}>
                                                <button
                                                    style={{
                                                        display: "block",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        flex: 1
                                                    }}
                                                >
                                                    <span>{id}</span>
                                                </button>

                                                    <span>
                                                        {viewModel.otherPeerMap.get(id)![1].isReady() ? <HiCheckCircle/> : <HiDotsCircleHorizontal/>}
                                                    </span>

                                                <button
                                                    className="squareButton"
                                                    onClick={() => void viewModel.removePeer(id)}
                                                    title={"Peer entfernen"}
                                                >
                                                    <HiTrash size={24}/>
                                                </button>
                                                </div>
                                            ))}
                                        </div></>)}
                            </div>
                        </div>
                    )}

                    {viewModel.activeTab === "database" && (
                        <div className="settingsContainer">
                            <h3>{t("settings.subsettings.database")}</h3>
                            {automergeFacade ? (
                                <DatabaseSettingsView automergeFacade={automergeFacade}
                                                      openedDatabaseName={openedDbName}
                                                      closeDatabase={closeDatabase!}/>
                            ) : (
                                <p>{t("settings.database.none")}</p>
                            )}
                        </div>
                    )}

                    {viewModel.activeTab === "about" && (
                        <div className="settingsContainer about-view" style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            gap: "20px"
                        }}>
                            <div>
                                <h2 style={{marginBottom: "5px"}}>{t("settings.subsettings.about")}</h2>
                            </div>

                            <section>
                                <p><strong>{t("settings.about.version")}</strong> 1.0.0</p>
                                <p><strong>{t("settings.about.license")}</strong> MIT License</p>
                            </section>

                            <section className="about-section">
                                <p>
                                    {t("settings.about.info")}
                                </p>
                            </section>

                            {/* Buttons für React und Automerge */}
                            <div className="about-buttons">
                                <button
                                    onClick={() => window.open("https://react.dev", "_blank")}
                                    style={{padding: "8px 15px", cursor: "pointer"}}>
                                    React Homepage
                                </button>

                                <button
                                    onClick={() => window.open("https://automerge.org", "_blank")}
                                    style={{padding: "8px 15px", cursor: "pointer"}}>
                                    Automerge Docs
                                </button>

                                <button
                                    onClick={() => window.open("https://github.com/SupremeTechnopriest/react-idle-timer", "_blank")}
                                    style={{padding: "8px 15px", cursor: "pointer"}}>
                                    Idle Timer
                                </button>

                                <button
                                    onClick={() => window.open("https://dndkit.com/", "_blank")}
                                    style={{padding: "8px 15px", cursor: "pointer"}}>
                                    DnD Kit
                                </button>

                                <button
                                    onClick={() => window.open("https://react-icons.github.io/react-icons/", "_blank")}
                                    style={{padding: "8px 15px", cursor: "pointer"}}>
                                    React Icons
                                </button>

                                <button
                                    onClick={() => window.open("https://github.com/nimiq/qr-scanner", "_blank")}
                                    style={{padding: "8px 15px", cursor: "pointer"}}>
                                    QR Scanner
                                </button>

                                <button
                                    onClick={() => window.open("https://github.com/rosskhanas/react-qr-code", "_blank")}
                                    style={{padding: "8px 15px", cursor: "pointer"}}>
                                    React QR Code
                                </button>
                            </div>

                            <section className="license-notice"
                                     style={{fontSize: "0.8em", opacity: 0.7, marginTop: "20px"}}>
                                <p>Copyright © {new Date().getFullYear()}</p>
                                <p style={{maxWidth: "500px"}}>
                                    {t("settings.about.license_notice")}
                                    <br/>
                                    <a href={"https://opensource.org/license/mit"}>
                                        MIT-Lizenz
                                    </a>
                                </p>
                            </section>
                        </div>
                    )}
                </main>
            </div>
        </Dialog>
    );
};

export default SettingsView;
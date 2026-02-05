import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";
import {Settings} from "../../Model/Settings.ts";

import React from "react";
import {type AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import DatabaseSettingsView from "./DialogViews/DatabaseSettingsView.tsx";
import Close from "./Icons/Close.tsx";
import {HiMiniCog8Tooth, HiMiniMinus, HiMiniPlus} from "react-icons/hi2";
import AddServerDialog from "./DialogViews/AddServerDialog.tsx";
import {HiTrash} from "react-icons/hi";
import Dialog from "./DialogViews/Dialog.tsx";

/**
 * The View that represents the Settings Dialog and Button to open it
 * @param automergeFacade the current AutomergeFacade instance
 * @param openedDbName the name of the currently opened database
 */
const SettingsView: React.FC<{
    automergeFacade?: AutomergeFacade | null,
    openedDbName?: string
}> = ({automergeFacade, openedDbName}) => {
    const viewModel = useSettingsViewModel();

    if (!viewModel.settingsOpen) {
        return (
            <button className="settingsButton" onClick={() => viewModel.setSettingsOpen(true)}>
                <HiMiniCog8Tooth size={24}/>
            </button>
        );
    }

    return (
        <Dialog
            title="Einstellungen"
            onCloseDialog={() => viewModel.setSettingsOpen(false)}
        >
            <div className="settingsBackground dialogOverlay">
                <div className="dialog settings-layout">
                    <Close className="closeIcon" color={"var(--text)"}
                           onClick={() => viewModel.setSettingsOpen(false)}/>
                    {/* Sidebar Navigation */}
                    <aside className="settings-sidebar">
                        <h2 style={{alignSelf: "flex-start"}}>Einstellungen</h2>
                        <button className={`settings-tab ${viewModel.activeTab === "general" ? "active" : ""}`}
                                onClick={() => viewModel.setActiveTab("general")}>
                            Allgemeine Einstellungen
                        </button>
                        <button className={`settings-tab ${viewModel.activeTab === "database" ? "active" : ""}`}
                                onClick={() => viewModel.setActiveTab("database")}>
                            Datenbankeinstellungen
                        </button>
                        <button className={`settings-tab ${viewModel.activeTab === "about" ? "active" : ""}`}
                                onClick={() => viewModel.setActiveTab("about")}>
                            Über die App
                        </button>
                    </aside>


                    {/* Main Content Area */}
                    <main className="scrollableContainer settings-content">
                        {viewModel.activeTab === "general" && (
                            <div className="settingsContainer">
                                <h3>Allgemeine Einstellungen</h3>


                                <label className="checkboxRow">
                                    <label className="switch">
                                        <input type="checkbox" checked={viewModel.darkMode}
                                               onChange={viewModel.toggleDarkMode}/>
                                        <span className="slider round"></span>
                                    </label>
                                    Dark-Mode
                                </label>

                                <label className="checkboxRow">
                                    <label className="switch">
                                        <input type="checkbox" checked={viewModel.synchronisation}
                                               onChange={viewModel.toggleSynchronisation}/>
                                        <span className="slider round"></span>
                                    </label>
                                    Synchronisation
                                </label>

                                <label className="checkboxRow">
                                    <label className="switch">
                                        <input type="checkbox" checked={viewModel.P2P}
                                               onChange={viewModel.toggleP2P}/>
                                        <span className="slider round"></span>
                                    </label>
                                    Peer-to-Peer Synchronisation
                                </label>

                                <label className="checkboxRow">
                                    <label className="switch">
                                        <input type="checkbox" checked={viewModel.timeOutActive}
                                               onChange={viewModel.toggleTimeOutActive}/>
                                        <span className="slider round"></span>
                                    </label>

                                    Bei Inaktivität abmelden
                                </label>

                                {viewModel.timeOutActive && (
                                    <div className={"timeout-setting"}>
                                        <label>Minuten bis Abmeldung: </label>
                                        <div className={"numberInput"}>
                                            <input type="number" style={{maxHeight: "2.5rem"}}
                                                   value={viewModel.timeoutLength}
                                                   onChange={(e) => viewModel.setTimeOutLengthVM(e.target.value)}
                                                   min="1"/>
                                            <button className={"squareButton"} style={{boxShadow: "none"}}
                                                    onClick={viewModel.decreaseTimeout}><HiMiniMinus size={24}/>
                                            </button>
                                            <button className={"squareButton"} style={{boxShadow: "none"}}
                                                    onClick={viewModel.increaseTimeout}><HiMiniPlus size={24}/></button>
                                        </div>
                                    </div>
                                )}

                                {automergeFacade ? null : (
                                    <div className="connection-settings">
                                        <h4>Synchronisationsserver</h4>
                                        <span>Aktueller Server:</span>
                                        <div className="current-server">{viewModel.serverName}</div>
                                        {viewModel.serverNames.length > 1 && (
                                            <div className="scrollableContainer server-list">
                                                <span>Verfügbare Server:</span>

                                                {viewModel.serverNames.map((server) => (
                                                    viewModel.serverName !== server ? (
                                                        <div className="server-item">
                                                            <button
                                                                style={{
                                                                    display: "block",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    flex: 1
                                                                }}
                                                                onClick={() => viewModel.selectServer(server)}
                                                            >
                                                                <span>{server}</span>
                                                            </button>
                                                            {server !== "Automerge Sync Server" && (
                                                                <button
                                                                    className="squareButton"
                                                                    onClick={() => viewModel.removeServer(server)}
                                                                >
                                                                    <HiTrash size={24}/>
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : null
                                                ))}
                                            </div>)}
                                        <button
                                            className="squareButton"
                                            onClick={() => viewModel.setAddServerDialogOpen(true)}
                                            style={{alignSelf: "center"}}
                                        >
                                            <HiMiniPlus size={24}/>
                                        </button>
                                        {viewModel.addServerDialogOpen && (
                                            <AddServerDialog
                                                onAddServer={(name, url) => viewModel.addServer(name, url)}
                                                onClose={() => viewModel.setAddServerDialogOpen(false)}
                                            />
                                        )}
                                        {!viewModel.P2P ? null :
                                            <div className={"connection-settings"}>

                                                <h4>Peer-To-Peer Verbidung</h4>
                                                <label>Eigene Peer-ID:</label>
                                                <label className={"current-server"}>{viewModel.getPeerId()}</label>
                                                <label>Fremde Peer-ID:</label>
                                                <input type="text"
                                                       onChange={(e) => viewModel.setConnection(e.target.value)}
                                                       value={Settings.getSettings().getConnector().peer}
                                                       style={{marginBottom: "2vh"}}
                                                />
                                            </div>
                                        }
                                    </div>
                                )}
                            </div>
                        )}

                        {viewModel.activeTab === "database" && (
                            <div className="settingsContainer">
                                <h3>Datenbankeinstellungen</h3>
                                {automergeFacade ? (
                                    <DatabaseSettingsView automergeFacade={automergeFacade}
                                                          openedDatabaseName={openedDbName}/>
                                ) : (
                                    <p>Bitte Datenbank auswählen.</p>
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
                                    <h2 style={{marginBottom: "5px"}}>Über diese Anwendung</h2>
                                </div>

                                <section>
                                    <p><strong>Version:</strong> 0.1.0-beta</p>
                                    <p><strong>Lizenz:</strong> MIT License</p>
                                </section>

                                <section className="about-section">
                                    <p>
                                        Dies ist eine kollaborative Anwendung zur Datenverwaltung.
                                        Dabei wird die Datenspeicherung und Übertragung mithilfe der Automerge
                                        Bibliothek
                                        implementiert.

                                        Zusätzlich benutzt werden die Bibliotheken Idle Timer, React DnD Kit, React
                                        Icons, QR Scanner und React QR Code.
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
                                        Die Software wird "wie besehen" bereitgestellt, ohne jegliche ausdrückliche oder
                                        implizierte Gewährleistung.
                                    </p>
                                </section>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </Dialog>
    );
};

export default SettingsView;
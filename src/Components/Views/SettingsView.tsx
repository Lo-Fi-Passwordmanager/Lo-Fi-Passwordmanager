import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";
import {Settings} from "../../Model/Settings.ts";

import React from "react";
import  {type AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import DatabaseSettingsView from "./DialogViews/DatabaseSettingsView.tsx";
import Close from "./Icons/Close.tsx";
import {HiMiniCog8Tooth, HiMiniMinus, HiMiniPlus} from "react-icons/hi2";
import AddServerDialog from "./DialogViews/AddServerDialog.tsx";
import {HiTrash} from "react-icons/hi";
import Dialog from "./DialogViews/Dialog.tsx";

const SettingsView: React.FC<{
    automergeFacade?: AutomergeFacade | null,
    openedDbName?: string
}> = ({automergeFacade, openedDbName}) => {
    const viewmodel = useSettingsViewModel();

    if (!viewmodel.settingsOpen) {
        return (
            <button className="settingsButton" onClick={() => viewmodel.setSettingsOpen(true)}>
                <HiMiniCog8Tooth size={24}/>
            </button>
        );
    }

    return (
        <Dialog
            title="Einstellungen"
            onCloseDialog={() => viewmodel.setSettingsOpen(false)}
        >
            <div className="settingsBackground dialogOverlay">
                <div className="dialog settings-layout">
                    <Close className="closeIcon" color={"var(--text)"}
                           onClick={() => viewmodel.setSettingsOpen(false)}/>
                    {/* Sidebar Navigation */}
                    <aside className="settings-sidebar">
                        <h2 style={{alignSelf: "flex-start"}}>Einstellungen</h2>
                        <button className={`settings-tab ${viewmodel.activeTab === "general" ? "active" : ""}`}
                                onClick={() => viewmodel.setActiveTab("general")}>
                            Allgemeine Einstellungen
                        </button>
                        <button className={`settings-tab ${viewmodel.activeTab === "database" ? "active" : ""}`}
                                onClick={() => viewmodel.setActiveTab("database")}>
                            Datenbankeinstellungen
                        </button>
                        <button className={`settings-tab ${viewmodel.activeTab === "about" ? "active" : ""}`}
                                onClick={() => viewmodel.setActiveTab("about")}>
                            Über die App
                        </button>
                    </aside>


                    {/* Main Content Area */}
                    <main className="scrollableContainer settings-content">
                        {viewmodel.activeTab === "general" && (
                            <div className="settingsContainer">
                                <h3>Allgemeine Einstellungen</h3>
                                <label className="checkboxRow">
                                    <input type="checkbox" checked={viewmodel.darkMode}
                                           onChange={viewmodel.toggleDarkMode}/>
                                    Dark-Mode
                                </label>

                                <label className="checkboxRow">
                                    <input type="checkbox" checked={viewmodel.synchronisation}
                                           onChange={viewmodel.toggleSynchronisation}/>
                                    Synchronisation
                                </label>

                                <label className="checkboxRow">
                                    <input type="checkbox" checked={viewmodel.timeOutActive}
                                           onChange={viewmodel.toggleTimeOutActive}/>
                                    Bei Inaktivität abmelden
                                </label>

                                {viewmodel.timeOutActive && (
                                    <div className={"timeout-setting"}>
                                        <label>Minuten bis Abmeldung: </label>
                                        <div className={"numberInput"}>
                                            <input type="number" style={{maxHeight: "2.5rem"}}
                                                   value={viewmodel.timeoutLength}
                                                   onChange={(e) => viewmodel.setTimeOutLengthVM(e.target.value)}
                                                   min="1"/>
                                            <button className={"squareButton"} style={{boxShadow: "none"}}
                                                    onClick={viewmodel.decrease}><HiMiniMinus size={24}/></button>
                                            <button className={"squareButton"} style={{boxShadow: "none"}}
                                                    onClick={viewmodel.increase}><HiMiniPlus size={24}/></button>
                                        </div>
                                    </div>
                                )}

                                {automergeFacade ? null : (
                                    <div className="server-settings">
                                        <h4>Synchronisationsserver</h4>
                                        <span>Aktueller Server:</span>
                                        <div className="current-server">{viewmodel.serverName}</div>
                                        {viewmodel.serverNames.length > 1 && (
                                            <div className="scrollableContainer server-list">
                                                <span>Verfügbare Server:</span>

                                                {viewmodel.serverNames.map((server) => (
                                                    viewmodel.serverName !== server ? (
                                                        <div className="server-item">
                                                            <button
                                                                style={{
                                                                    display: "block",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    flex: 1
                                                                }}
                                                                onClick={() => viewmodel.selectServer(server)}
                                                            >
                                                                <span>{server}</span>
                                                            </button>
                                                            {server !== "Automerge Sync Server" && (
                                                                <button
                                                                    className="squareButton"
                                                                    onClick={() => viewmodel.removeServer(server)}
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
                                            onClick={() => viewmodel.setAddServerDialogOpen(true)}
                                            style={{alignSelf: "center"}}
                                        >
                                            <HiMiniPlus size={24}/>
                                        </button>
                                        {viewmodel.addServerDialogOpen && (
                                            <AddServerDialog
                                                onAddServer={(name, url) => viewmodel.addServer(name, url)}
                                                onClose={() => viewmodel.setAddServerDialogOpen(false)}
                                            />
                                        )}</div>
                            )}

                            <div>
                                <label>{"Deine Peer Id: \n"}</label>
                            </div>
                            <div>
                                <label>{viewmodel.getPeerId()}</label>
                            </div>

                            <label>Other Peer Id</label>
                            <input type="text"
                                   onChange={(e) => viewmodel.setConnection(e.target.value)}
                                   value={Settings.getSettings().getConnector().peer}/>
                            <button onClick={() => viewmodel.setSettingsOpen(false)} style={{marginTop: "1em"}}>Einstellungen
                                Schließen
                            </button>
                        </div>
                    )}

                        {viewmodel.activeTab === "database" && (
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

                        {viewmodel.activeTab === "about" && (
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
                                        onClick={() => window.open("https://github.com/nimiq/qr-scanner", "_blank")}
                                        style={{padding: "8px 15px", cursor: "pointer"}}>
                                        QR Scanner
                                    </button>

                                    <button
                                        onClick={() => window.open("https://github.com/rosskhanas/react-qr-code", "_blank")}
                                        style={{padding: "8px 15px", cursor: "pointer"}}>
                                        React Icons
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
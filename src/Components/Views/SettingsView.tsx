import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";
import React from "react";
import type {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import DatabaseSettingsView from "./DialogViews/DatabaseSettingsView.tsx";
import Close from "./Icons/Close.tsx";
import AddServerDialog from "./DialogViews/AddServerDialog.tsx";

const SettingsView: React.FC<{
    automergeFacade?: AutomergeFacade | null;
}> = ({automergeFacade}) => {
    const viewmodel = useSettingsViewModel();

    if (!viewmodel.settingsOpen) {
        return (
            <button className="settingsButton" onClick={() => viewmodel.setSettingsOpen(true)}>⚙️</button>
        );
    }

    return (
        <div className="settingsBackground dialogOverlay">
            <div className="dialog settings-layout">
                <Close className="closeIcon" color={"var(--text)"} onClick={() => viewmodel.setSettingsOpen(false)}/>
                {/* Sidebar Navigation */}
                <aside className="settings-sidebar">
                    <h2>Einstellungen</h2>
                    <button onClick={() => viewmodel.setActiveTab("general")}>
                        Allgemeine Einstellungen
                    </button>
                    <button onClick={() => viewmodel.setActiveTab("database")}>
                        Datenbankeinstellungen
                    </button>
                    <button onClick={() => viewmodel.setActiveTab("about")}>
                        Über die App
                    </button>
                </aside>


                {/* Main Content Area */}
                <main className="settings-content">
                    {viewmodel.activeTab === "general" && (
                        <div className="settingsContainer">
                            <h3>Allgemeine Einstellungen</h3>
                            <label className="checkboxRow">
                                <input type="checkbox" checked={viewmodel.darkMode}
                                       onChange={viewmodel.toggleDarkMode}/>
                                Darkmode
                            </label>

                            <label className="checkboxRow">
                                <input type="checkbox" checked={viewmodel.synchronisation}
                                       onChange={viewmodel.toggleSynchronisation}/>
                                Synchronisation
                            </label>

                            {/* not working right now
                            <label className="checkboxRow">
                                <input type="checkbox" checked={viewmodel.autoConflictRes}
                                       onChange={viewmodel.toggleAutoConflictRes}/>
                                Konfliktauflösung
                            </label>
                            */}

                            <label className="checkboxRow">
                                <input type="checkbox" checked={viewmodel.timeOutActive}
                                       onChange={viewmodel.toggleTimeOutActive}/>
                                Bei Inaktivität abmelden
                            </label>

                            {viewmodel.timeOutActive && (
                                <div className={"timeout-setting"}>
                                    <label>Minuten bis Abmeldung: </label>
                                    <div className={"numberInput"}>
                                        <input type="number" value={viewmodel.timeoutLength}
                                               onChange={(e) => viewmodel.setTimeOutLengthVM(e.target.value)} min="1"/>
                                        <button onClick={viewmodel.decrease}>–</button>
                                        <button onClick={viewmodel.increase}>+</button>
                                    </div>
                                </div>
                            )}

                            {automergeFacade ? (
                                null
                            ) : (
                                <div className="server-settings">
                                    <h4>Synchronisationsserver</h4>
                                    <span>Aktueller Server:</span>
                                    <div className="current-server">{viewmodel.serverName}</div>
                                    {viewmodel.serverNames.length > 1 && (<div className="server-list">
                                        {viewmodel.serverNames.map((server) => (
                                            viewmodel.serverName !== server ? (
                                                <div className="server-item">
                                                    <button
                                                        onClick={() => viewmodel.selectServer(server)}
                                                        style={{width: "100%"}}
                                                    >
                                                        <span>{server}</span>
                                                    </button>
                                                    {server !== "Automerge Sync Server" && (
                                                        <button
                                                            onClick={() => viewmodel.removeServer(server)}
                                                        >🗑️</button>
                                                    )}
                                                </div>
                                            ) : null
                                        ))}
                                    </div>)}
                                    <button onClick={() => viewmodel.setAddServerDialogOpen(true)}>+</button>
                                    {viewmodel.addServerDialogOpen && (
                                        <AddServerDialog
                                            onAddServer={(name, url) => viewmodel.addServer(name, url)}
                                            onClose={() => viewmodel.setAddServerDialogOpen(false)}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {viewmodel.activeTab === "database" && (
                        <div className="settingsContainer">
                            <h3>Datenbankeinstellungen</h3>
                            {automergeFacade ? (
                                <DatabaseSettingsView automergeFacade={automergeFacade}/>
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

                            <section className="about-section">
                                <p><strong>Version:</strong> 0.1.0-beta</p>
                                <p><strong>Lizenz:</strong> MIT License</p>
                            </section>

                            <section className="about-section">
                                <p>
                                    Dies ist eine kollaborative Anwendung zur Datenverwaltung.
                                    Dabei wird die Datenspeicherung und Übertragung mithilfe der Automerge Bibliothek
                                    implementiert.

                                    Zusätzlich benutzt werden die Bibliotheken Idle Timer und React DnD Kit.
                                </p>
                            </section>

                            {/* Buttons für React und Automerge */}
                            <div style={{display: "flex", gap: "10px", justifyContent: "center"}}>
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
    );
};

export default SettingsView;
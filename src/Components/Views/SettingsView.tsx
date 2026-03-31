import React from "react";
import {HiTrash, HiCheckCircle, HiDotsCircleHorizontal} from "react-icons/hi";
import {HiMiniCog8Tooth, HiMiniMinus, HiMiniPlus} from "react-icons/hi2";

import {type AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {useSettingsViewModel} from "../ViewModels/SettingsViewModel.ts";
import CopyButton from "./ButtonViews/CopyButton.tsx";
import SliderCheckBox from "./ButtonViews/SliderCheckBox.tsx";
import DatabaseSettingsView from "./DialogViews/DatabaseSettingsView.tsx";
import Dialog from "./DialogViews/Dialog.tsx";
import GenericQRDialog from "./DialogViews/GenericQRDialog.tsx";
import GenericQRScannerDialog from "./DialogViews/GenericQRScannerDialog.tsx";
import ToastDialog from "./DialogViews/ToastDialog.tsx";
import ServerList from "./ListingViews/ServerList.tsx";


/**
 * The View that represents the Settings Dialog and Button to open it
 * @param automergeFacade the current AutomergeFacade instance
 * @param openedDbName the name of the currently opened database
 * @param closeDatabase a function to close the currently opened database
 */
const SettingsView: React.FC<{
    automergeFacade?: AutomergeFacade | null,
    openedDbName?: string,
    closeDatabase?: () => void,
}> = ({automergeFacade, openedDbName, closeDatabase}) => {
    const viewModel = useSettingsViewModel();

    if (!viewModel.settingsOpen) {
        return (<>
            <button className="settingsButton" onClick={() => viewModel.setSettingsOpen(true)}
                    title="Einstellungen öffnen">
                <HiMiniCog8Tooth size={24}/>
            </button>
            <ToastDialog message={viewModel.toastMessage}
                         isVisible={viewModel.showToast}
                         onClose={() => viewModel.setShowToast(false)}/>
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
                    <h2 style={{alignSelf: "flex-start"}}>Einstellungen</h2>
                    <button className={`settings-tab ${viewModel.activeTab === "general" ? "active" : ""}`}
                            onClick={() => viewModel.setActiveTab("general")}>
                        Allgemein
                    </button>
                    <button className={`settings-tab ${viewModel.activeTab === "appearance" ? "active" : ""}`}
                            onClick={() => viewModel.setActiveTab("appearance")}>
                        Erscheinungsbild
                    </button>
                    <button className={`settings-tab ${viewModel.activeTab === "database" ? "active" : ""}`}
                            onClick={() => viewModel.setActiveTab("database")}>
                        Datenbank
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
                                <SliderCheckBox checked={viewModel.synchronisation}
                                                toggleChecked={viewModel.toggleSynchronisation}/>
                                Server Synchronisation
                            </label>

                            <label className="checkboxRow">
                                <SliderCheckBox checked={viewModel.P2P} toggleChecked={viewModel.toggleP2P}/>
                                Peer-to-Peer Synchronisation
                            </label>

                            <label className="checkboxRow">
                                <SliderCheckBox checked={viewModel.timeOutActive}
                                                toggleChecked={viewModel.toggleTimeOutActive}/>
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
                                                onClick={viewModel.decreaseTimeout}
                                                title={"Zeit bis Abmeldung verringern"}><HiMiniMinus size={24}/>
                                        </button>
                                        <button className={"squareButton"} style={{boxShadow: "none"}}
                                                onClick={viewModel.increaseTimeout}
                                                title={"Zeit bis Abmeldung erhöhen"}><HiMiniPlus size={24}/></button>
                                    </div>
                                </div>
                            )}
                            <div className="sub-settings">
                                {!viewModel.synchronisation ? null : (
                                    <ServerList settingsViewModel={viewModel}/>
                                )}


                                {!viewModel.P2P ? null :
                                    <div className={"sub-settings"}>

                                        <h4>Peer-To-Peer Verbindung</h4>
                                        <label>Eigene Peer-ID:</label>

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
                                            <GenericQRDialog title={"Peer-ID teilen"}
                                                             qrValue={viewModel.getPeerId()}>
                                                <p>Scanne den QR-Code auf einem anderen Gerät in den Einstellungen
                                                    unter &quot;Allgemeine
                                                    Einstellungen&quot; &rarr; &quot;Peer-To-Peer
                                                    Verbindung&quot;</p>
                                            </GenericQRDialog>
                                        </div>
                                        <label>Fremde Peer-ID:</label>
                                        <div className={"peer-connection-input"}
                                             style={{
                                                 display: "flex",
                                                 marginBottom: "2vh",
                                                 gap: "10px",
                                                 justifyContent: "space-between",
                                                 width: "100%"
                                             }}> {/* for some reason are the styles from the css not applying */}
                                            <div className={"input-with-qr-container"}
                                                 style={{position: "relative", width: "100%"}}>
                                                <input type="text"
                                                       value={viewModel.remotePeerId}
                                                       onChange={(e) => viewModel.setRemotePeerId(e.target.value)}
                                                       style={{
                                                           paddingRight: "40px",
                                                           textOverflow: "ellipsis",
                                                           overflow: "hidden",
                                                           whiteSpace: "nowrap"
                                                       }}
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
                                                Verbinden
                                            </button>
                                        </div>
                                    </div>
                                }

                                {viewModel.otherPeerMap.size > 0 && viewModel.P2P && (
                                    <>
                                        <span>Verbundene Peers:</span>
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
                                                        {viewModel.otherPeerMap.get(id)![1].isReady() ?
                                                            <HiCheckCircle/> : <HiDotsCircleHorizontal/>}
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
                                        </div>
                                    </>)}
                            </div>
                        </div>
                    )}

                    {viewModel.activeTab === "appearance" && (
                        <div className="settingsContainer">
                            <h3>Erscheinungsbildeinstellungen</h3>
                            <div className={"sub-settings"}>
                                <h4>Theme</h4>
                                <label className="checkboxRow">
                                    <SliderCheckBox checked={viewModel.darkMode}
                                                    toggleChecked={viewModel.toggleDarkMode}/>
                                    Dark-Mode
                                </label>
                            </div>
                            <div className={"sub-settings"}>
                                <h4>Farbschema</h4>
                                <div className={"color-list"}>
                                    {Array.from(viewModel.colorSchemes.entries()).map(([key, colors], index) => (
                                        <button key={index}
                                                className={`color-scheme-button ${viewModel.activeColorIndex === index ? "selected" : ""}`}
                                                style={{
                                                    backgroundColor: `#${colors[0]}`,
                                                }}
                                                onClick={() => viewModel.changeColorScheme(index)}
                                                title={`${key} auswählen`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {viewModel.activeTab === "database" && (
                        <div className="settingsContainer">
                            <h3>Datenbankeinstellungen</h3>
                            {automergeFacade ? (
                                <DatabaseSettingsView automergeFacade={automergeFacade}
                                                      openedDatabaseName={openedDbName}
                                                      closeDatabase={closeDatabase!}/>
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
                                <p><strong>Version:</strong> 0.6.7-sigma</p>
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
                                    Die Software wird &quot;wie besehen&quot; bereitgestellt, ohne jegliche Haftung.
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
            <ToastDialog message={viewModel.toastMessage}
                         isVisible={viewModel.showToast}
                         onClose={() => viewModel.setShowToast(false)}/>
        </Dialog>
    );
};

export default SettingsView;
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {Settings} from "../../src/Model/Settings";


class MockDataConnection {
    peer: string;
    listeners: Record<string, Function> = {};
    send = vi.fn();
    close = vi.fn();

    constructor(peerId: string) { this.peer = peerId; }

    on = vi.fn((ev, cb) => { this.listeners[ev] = cb; });

    _trigger(ev: string, data?: any) { this.listeners[ev]?.(data); }
}

let activeMockPeer: any;
vi.mock("peerjs", () => {
    return {
        default: class {
            listeners: Record<string, Function> = {};
            on = vi.fn((ev, cb) => { this.listeners[ev] = cb; });
            connect = vi.fn((id) => new MockDataConnection(id));
            _trigger = (ev: string, data?: any) => { this.listeners[ev]?.(data); };

            constructor() { activeMockPeer = this; }
        }
    };
});

const MockAdapterSpy = vi.fn();
vi.mock("../../customNetworkAdapter/PeerJsNetworkAdapter.ts", () => ({
    PeerjsNetworkAdapter: class {
        disconnect = vi.fn();

        constructor(conn: any) { MockAdapterSpy(conn); }
    }
}));


describe("Settings", () => {
    let settings: Settings;
    //TODO settings vom local storage testen
    beforeEach(() => {
        settings = Settings.getSettings();
    });

    afterEach(() => {
        settings = null;
    });

    it("should be able to get Settings", () => {
        expect(settings).toBeInstanceOf(Settings);
    });

    it("should be a Singleton", () => {
        const settings2 = Settings.getSettings();
        expect(settings2).toBe(settings);
    });


    it("should be able to set and get dark mode", () => {
        settings.setDarkMode(true);
        expect(settings.getDarkMode()).toBe(true);
        settings.setDarkMode(false);
        expect(settings.getDarkMode()).toBe(false);
    });

    it("should be able to set and get the Synchronisation", () => {
        settings.setSynchronization(true);
        expect(settings.getSynchronization()).toBe(true);
        settings.setSynchronization(false);
        expect(settings.getSynchronization()).toBe(false);
    });


    it("should be able to set and get auto timeout", () => {
        settings.setTimeoutActive(true);
        expect(settings.getTimeoutActive()).toBe(true);
        settings.setTimeoutActive(false);
        expect(settings.getTimeoutActive()).toBe(false);
    });

    it("should be able to add a new server", () => {
        settings.addServer("name", "url");
        expect(settings.getServerStates().size).toBe(2);
    });

    it("should be able to activate a new server", () => {
        settings.addServer("name", "url");
        expect(settings.getServerStates().size).toBe(2);
        settings.activateServer("name");
        // @ts-ignore
        expect(settings.getActiveServerUrls()).toStrictEqual([import.meta.env.VITE_DEFAULT_SYNC_SERVER_URL, "url"]);
    });

    it("should be able to remove a server", () => {
        settings.addServer("name", "url");
        expect(settings.getServerStates().size).toBe(2);
        settings.removeServer("name");
        expect(settings.getServerStates().size).toBe(1);
    });

    it("should activate P2P Synchronisation", () => {
        settings.setP2PActive(true);
        expect(settings.getP2P()).toBe(true);
        settings.setP2PActive(false);
        expect(settings.getP2P()).toBe(false);
    });

    it("should initialize PeerJS on creation and listen for incoming connections", () => {
        expect(settings.getPeer()).toBeDefined();
        expect(activeMockPeer.on).toHaveBeenCalledWith("connection", expect.any(Function));
    });

    it("should successfully add a connector and set it up when 'open' is triggered", () => {
        const mockConn = new MockDataConnection("remote-peer-id");
        activeMockPeer.connect.mockReturnValue(mockConn);

        settings.addConnector("remote-peer-id");
        expect(activeMockPeer.connect).toHaveBeenCalledWith("remote-peer-id");

        mockConn._trigger("open");

        const connectors = settings.getConnectorsToAdapters();
        expect(connectors.has("remote-peer-id")).toBe(true);

        expect(MockAdapterSpy).toHaveBeenCalledWith(mockConn);
    });

    it("should handle incoming connections properly", () => {
        const incomingConn = new MockDataConnection("incoming-peer-id");

        //simulate another peer connecting and then opening the channel
        activeMockPeer._trigger("connection", incomingConn);
        incomingConn._trigger("open");

        //verify that it added the reverse direction
        const connectors = settings.getConnectorsToAdapters();
        expect(connectors.has("incoming-peer-id")).toBe(true);
    });

    it("should remove a connector, send disconnect signal, and clean up", async () => {
        // Setup a mocked connection first
        const mockConn = new MockDataConnection("peer-to-remove");
        activeMockPeer.connect.mockReturnValue(mockConn);
        settings.addConnector("peer-to-remove");
        mockConn._trigger("open"); // Triggers setupConnection


        const [, adapter] = settings.getConnectorsToAdapters().get("peer-to-remove")!;
        await settings.removeConnector("peer-to-remove");

        expect(mockConn.send).toHaveBeenCalledWith({type: "disconnect"});
        expect(settings.getConnectorsToAdapters().has("peer-to-remove")).toBe(false);
        expect(adapter.disconnect).toHaveBeenCalled();
        expect(mockConn.close).toHaveBeenCalled();
    });

    it("should clean up connection if the remote peer sends a 'disconnect' data message", () => {
        const mockConn = new MockDataConnection("myPeer");
        activeMockPeer.connect.mockReturnValue(mockConn);
        settings.addConnector("myPeer");
        mockConn._trigger("open");

        const [, adapter] = settings.getConnectorsToAdapters().get("myPeer")!;

        // Simulate receiving a disconnect message from the remote peer
        mockConn._trigger("data", {type: "disconnect"});


        expect(settings.getConnectorsToAdapters().has("myPeer")).toBe(false);
        expect(adapter.disconnect).toHaveBeenCalled();
        expect(mockConn.close).toHaveBeenCalled();
    });

    it("should clean up connection if the remote peer triggers a 'close' event", () => {
        const mockConn = new MockDataConnection("closing-peer");
        activeMockPeer.connect.mockReturnValue(mockConn);
        settings.addConnector("closing-peer");
        mockConn._trigger("open");

        const [, adapter] = settings.getConnectorsToAdapters().get("closing-peer")!;

        // Simulate the connection closing unexpectedly
        mockConn._trigger("close");

        // Assertions
        expect(settings.getConnectorsToAdapters().has("closing-peer")).toBe(false);
        expect(adapter.disconnect).toHaveBeenCalled();
        expect(mockConn.close).toHaveBeenCalled();
    });

});
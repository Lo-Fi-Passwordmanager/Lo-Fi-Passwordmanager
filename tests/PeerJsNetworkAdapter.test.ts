import { describe, it, expect, beforeEach, vi } from "vitest";
import { PeerjsNetworkAdapter } from "../src/PeerJsNetworkAdapter";
import { EventEmitter } from "eventemitter3";

/**
 * Minimal DataConnection mock
 * made by ChatGPT
 */
class MockDataConnection extends EventEmitter {
    peer: string;
    open = false;
    send = vi.fn();

    constructor(peer: string) {
        super();
        this.peer = peer;
    }

    triggerOpen() {
        this.open = true;
        this.emit("open");
    }

    triggerClose() {
        this.open = false;
        this.emit("close");
    }

    triggerData(data: any) {
        this.emit("data", data);
    }
}

describe("PeerjsNetworkAdapter", () => {
    let conn: MockDataConnection;
    let adapter: PeerjsNetworkAdapter;

    beforeEach(() => {
        conn = new MockDataConnection("remote-peer");
        adapter = new PeerjsNetworkAdapter(conn as any);
    });

    it("returns peer id from connection", () => {
        expect(adapter.getPeerId()).toBe("remote-peer");
    });

    it("sends arrive message on open", () => {
        adapter.connect("local-peer", { name: "test" });

        conn.triggerOpen();

        expect(conn.send).toHaveBeenCalledWith({
            type: "arrive",
            senderId: "local-peer",
            peerMetadata: { name: "test" },
        });
    });

    it("responds to arrive with welcome", () => {
        adapter.connect("local-peer");

        conn.triggerData({
            type: "arrive",
            senderId: "remote-peer",
            peerMetadata: { foo: "bar" },
        });

        expect(conn.send).toHaveBeenCalledWith({
            type: "welcome",
            senderId: "local-peer",
            targetId: "remote-peer",
            peerMetadata: { foo: "bar" }
        });
    });

    it("emits peer-candidate on welcome", () => {
        const spy = vi.fn();
        adapter.on("peer-candidate", spy);

        adapter.connect("local-peer");

        conn.triggerData({
            type: "welcome",
            senderId: "remote-peer",
            peerMetadata: { x: 1 },
        });

        expect(spy).toHaveBeenCalledWith({
            peerId: "remote-peer",
            peerMetadata: { x: 1 },
        });
    });

    it("emits message event for normal payload", () => {
        const spy = vi.fn();
        adapter.on("message", spy);

        adapter.connect("local-peer");

        const payload = {
            type: "sync",
            senderId: "remote-peer",
            data: new Uint8Array([1, 2, 3]),
        };

        conn.triggerData(payload);

        expect(spy).toHaveBeenCalled();
        const msg = spy.mock.calls[0][0];
        expect(msg.data).toBeInstanceOf(Uint8Array);
        expect(msg.data.byteLength).toBe(3);
    });

    it("send() transmits data and emits alert", () => {
        adapter.connect("local-peer");

        const alertSpy = vi.fn();
        adapter.onData(alertSpy);

        const message = {
            type: "sync",
            senderId: "local-peer",
            targetId: "remote-peer",
            data: new Uint8Array([5, 6]),
        };

        adapter.send(message as any);

        expect(conn.send).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalled();

        const alert = alertSpy.mock.calls[0][0];
        expect(alert.direction).toBe("outgoing");
        expect(alert.bytes).toBe(2);
    });

    it("emits incoming alert on data", () => {
        adapter.connect("local-peer");

        const alertSpy = vi.fn();
        adapter.onData(alertSpy);

        conn.triggerData({
            type: "sync",
            senderId: "remote-peer",
            data: new Uint8Array([9, 9, 9]),
        });

        expect(alertSpy).toHaveBeenCalled();
        const alert = alertSpy.mock.calls[0][0];
        expect(alert.direction).toBe("incoming");
        expect(alert.bytes).toBe(3);
    });

    it("resolves whenReady after handshake", async () => {
        adapter.connect("local-peer");

        conn.triggerData({
            type: "welcome",
            senderId: "remote-peer",
            peerMetadata: {},
        });

        await adapter.whenReady();

        expect(adapter.isReady()).toBe(true);
    });

    it("emits close event when connection closes", () => {
        const spy = vi.fn();
        adapter.on("close", spy);

        adapter.connect("local-peer");

        conn.triggerClose();

        expect(spy).toHaveBeenCalled();
    });

    it("disconnect emits peer-disconnected", () => {
        const spy = vi.fn();
        adapter.on("peer-disconnected", spy);

        adapter.connect("local-peer");

        adapter.disconnect();

        expect(spy).toHaveBeenCalledWith({
            peerId: "local-peer",
        });
    });

    it("handles already-open connection", () => {
        conn.open = true;

        adapter.connect("local-peer");

        expect(conn.send).toHaveBeenCalledWith({
            type: "arrive",
            senderId: "local-peer",
            peerMetadata: {},
        });
    });
});

import type {Message, NetworkAdapterEvents, PeerId, RepoMessage} from "@automerge/automerge-repo";
import type {NetworkAdapterInterface} from "@automerge/react";
import {EventEmitter} from "eventemitter3";
import type {DataConnection} from "peerjs";

import type {
    ArriveMessage,
    IODirection,
    NetworkMessage,
    NetworkMessageAlert,
    PeerMetadata,
    WelcomeMessage
} from "./types.ts";

type EventTypes = { data: NetworkMessageAlert };

/**
 * An Automerge repo network-adapter for WebRTC (P2P)
 *
 * Based on:
 *    MessageChannelNetworkAdapter (point-to-point)
 *    https://github.com/automerge/automerge-repo/blob/main/packages/automerge-repo-network-messagechannel/src/index.ts
 *
 *
 *  copy of https://github.com/automerge/automerge-repo-network-peerjs
 *  with small changes
 */
export class PeerjsNetworkAdapter
    extends EventEmitter<NetworkAdapterEvents>
    implements NetworkAdapterInterface {
    peerId?: PeerId;
    peerMetadata?: PeerMetadata;

    #conn: DataConnection;
    #events = new EventEmitter<EventTypes>();

    #ready = false;
    #readyResolver?: () => void;
    #readyPromise: Promise<void> = new Promise<void>((resolve) => (this.#readyResolver = resolve));

    constructor(conn: DataConnection) {
        if (!conn) throw new Error(`A peerjs data-connection is required`);
        super();
        this.#conn = conn;
    }

    getPeerId(): string {
        return (this.#conn).peer;
    }

    isReady() {
        return this.#ready;
    }

    whenReady() {
        return this.#readyPromise;
    }

    connect(peerId: PeerId, meta?: PeerMetadata) {
        const senderId = (this.peerId = peerId);
        const conn = this.#conn;
        const peerMetadata = meta ?? {};

        const handleOpen = () => {
            //Arrive Handshake
            this.#transmit({type: "arrive", senderId, peerMetadata});
        };

        const handleClose = () => this.emit("close");
        const handleData = (e: unknown) => {
            const msg = e as NetworkMessage;

            /**
             * Arrive.
             */
            if (msg.type === "arrive") {
                const {peerMetadata} = msg as ArriveMessage;
                const targetId = msg.senderId;
                this.#transmit({type: "welcome", senderId, targetId, peerMetadata});
                this.#announceConnection(targetId, peerMetadata);
                return;
            }

            /**
             * Welcome.
             */
            if (msg.type === "welcome") {
                const {peerMetadata} = msg as WelcomeMessage;
                this.#announceConnection(msg.senderId, peerMetadata);
                return;
            }

            /**
             * Default (data payload).
             */
            let payload = msg as Message;
            if ("data" in msg) payload = {...payload, data: toUint8Array(msg.data!)};
            this.emit("message", payload);
            this.#alert("incoming", msg);
        };

        conn.on("open", handleOpen);
        conn.on("close", handleClose);
        conn.on("data", handleData);

        // FIX: If the connection is already open, trigger handleOpen manually
        if (conn.open) {
            handleOpen();
        }

        this.on("peer-disconnected", () => {
            this.#ready = false;
            conn.off("open", handleOpen);
            conn.off("close", handleClose);
            conn.off("data", handleData);
        });

        setTimeout(() => this.#ready = true, 100);
    }

    disconnect() {
        const peerId = this.peerId;
        if (peerId) this.emit("peer-disconnected", {peerId});
    }

    onData(fn: (e: NetworkMessageAlert) => void) {
        this.#events.on("data", fn);
        return () => this.#events.off("data", fn);
    }

    send(message: RepoMessage) {
        if (!this.#conn) throw new Error("Connection not ready");
        if ("data" in message) {
            this.#transmit({...message, data: toUint8Array(message.data)});
        } else {
            this.#transmit(message);
        }
    }

    #forceReady() {
        if (this.#ready) return;
        this.#ready = true;
        this.#readyResolver?.();
    }

    #transmit(message: NetworkMessage) {
        if (!this.#conn) throw new Error("Connection not ready");
        void this.#conn.send(message);
        this.#alert("outgoing", message);
    }

    #alert(direction: IODirection, message: NetworkMessage) {
        const bytes = "data" in message ? message.data?.byteLength ?? 0 : 0;
        const payload: NetworkMessageAlert = {direction, message, bytes};
        this.#events.emit("data", payload);
    }

    #announceConnection(peerId: PeerId, peerMetadata: PeerMetadata) {
        this.#forceReady();
        this.emit("peer-candidate", {peerId, peerMetadata});
    }
}

/**
 * Helpers
 */
function toUint8Array(input: Uint8Array): Uint8Array {
    return input instanceof Uint8Array ? input : new Uint8Array(input);
}
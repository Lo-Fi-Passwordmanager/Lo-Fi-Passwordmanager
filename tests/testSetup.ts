//Für react hooks testen
import '@testing-library/jest-dom'
import { webcrypto } from "node:crypto"

if (!globalThis.crypto) {
    globalThis.crypto = webcrypto as any
}

//Für indexedDb tests
import { setup } from 'vitest-indexeddb';
setup();

import {vi} from "vitest";
/*
vi.mock("peerjs", () => {
    class PeerMock {
        on = vi.fn();

        connect = vi.fn().mockReturnValue({
            on: vi.fn(),
            send: vi.fn(),
            close: vi.fn(),
        });

        destroy = vi.fn();
    }

    return {
        default: PeerMock,
    };
});*/
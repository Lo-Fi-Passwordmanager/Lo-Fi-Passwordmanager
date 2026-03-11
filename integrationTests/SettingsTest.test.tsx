import {describe, expect, it, vi} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {usePasswordManagerViewModel} from "../src/Components/ViewModels/PasswordManagerViewModel";
import {useLoginViewModel} from "../src/Components/ViewModels/loginViewModel";
import {RepoContext} from "@automerge/react";
import {useSettingsViewModel} from "../src/Components/ViewModels/SettingsViewModel";

vi.mock("@automerge/react", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@automerge/react")>();

    return {
        ...actual,
        WebSocketClientAdapter: class MockWebSocketClientAdapter {
            url: string;
            isMockWebSocket = true;

            constructor(url: string) {
                this.url = url;
            }

            connect = vi.fn();
            disconnect = vi.fn();
            on = vi.fn();
            off = vi.fn();
            emit = vi.fn();
        }
    };
});

let simulatePeerOpen: (() => void) | null = null;
vi.mock("peerjs", () => {
    return {
        default: class MockPeer {
            on = vi.fn();
            connect = vi.fn().mockImplementation((id) => {
                return {
                    peer: id,
                    on: (event: string, callback: any) => {
                        if (event === "open") {
                            simulatePeerOpen = callback;
                        }
                    },
                    send: vi.fn(),
                    close: vi.fn()
                };
            });
        }
    };
});


vi.mock("../customNetworkAdapter/PeerJsNetworkAdapter.ts", async () => {
    return {
        PeerjsNetworkAdapter: class MockPeerjsNetworkAdapter {
            connection: any;
            isMockP2P = true;

            constructor(connection: any) {
                this.connection = connection;
            }

            getPeerId() {
                return this.connection.peer;
            }

            connect = vi.fn(); disconnect = vi.fn();
            on = vi.fn(); off = vi.fn(); emit = vi.fn();
        }
    };
});

describe("Settings Integration Test ", () => {

    it('test the functionality of the settings', async () => {
        const passwordManagerHook = renderHook(() => usePasswordManagerViewModel());
        const {repo, securityProvider} = passwordManagerHook.result.current;

        const loginVM = renderHook(() => useLoginViewModel(
            repo,
            passwordManagerHook.result.current.setLoggedIn,
            passwordManagerHook.result.current.setAutomergeFacade,
            securityProvider,
            passwordManagerHook.result.current.setOpenedDatabaseName
        ));

        await act(async () => {
            loginVM.result.current.createDatabase("TestDB", "password123");
        });

        await waitFor(() => expect(passwordManagerHook.result.current.loggedIn).toBe(true));

        const wrapper = ({children}: { children: React.ReactNode }) => (
            // @ts-ignore
            <RepoContext.Provider value={repo}>{children}</RepoContext.Provider>
        );

        const settingsVM = renderHook(() => useSettingsViewModel(), {wrapper});

        // test dark mode toggle
        expect(settingsVM.result.current.darkMode).toBe(true);
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

        act(() => {
            settingsVM.result.current.toggleDarkMode();
        });
        expect(settingsVM.result.current.darkMode).toBe(false);
        expect(document.documentElement.getAttribute('data-theme')).not.toBe('dark');

        act(() => {
            settingsVM.result.current.toggleDarkMode();
        });
        expect(settingsVM.result.current.darkMode).toBe(true);
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

        // test synchronisation
        act(() => {
            settingsVM.result.current.toggleSynchronisation(); // turn sync off
        });

        await waitFor(() => {
            const adapters = passwordManagerHook.result.current.repo.networkSubsystem.adapters;
            expect(adapters.some((a: any) => a.isMockWebSocket)).toBe(false);
        });

        act(() => {
            settingsVM.result.current.toggleSynchronisation(); // turn sync on
        });

        await waitFor(() => {
            const adapters = passwordManagerHook.result.current.repo.networkSubsystem.adapters;
            const webSocketAdapter: any = adapters.find((a: any) => a.isMockWebSocket);

            expect(webSocketAdapter).toBeDefined();
            expect(webSocketAdapter.url).toBe("wss://sync.automerge.org");
        });


        // P2P test
        act(() => {
            settingsVM.result.current.toggleP2P(); // turn off
        });

        await waitFor(() => {
            const adapters = passwordManagerHook.result.current.repo.networkSubsystem.adapters;
            expect(adapters.some((a: any) => a.isMockP2P)).toBe(false);
        });

        act(() => {
            settingsVM.result.current.toggleP2P(); // turn on
        });

        act(() => {
            settingsVM.result.current.setConnection("fake-peer-id-123");
        });

        act(() => {
            expect(simulatePeerOpen).not.toBeNull();

            simulatePeerOpen!();
        });

        await waitFor(() => {
            const adapters = passwordManagerHook.result.current.repo.networkSubsystem.adapters;
            const p2pAdapter: any = adapters.find((a: any) => a.isMockP2P);

            expect(p2pAdapter).toBeDefined();
            expect(p2pAdapter.getPeerId()).toBe("fake-peer-id-123");
        });

        act(() => {
            settingsVM.result.current.toggleP2P(); // turn off
        });

        await waitFor(() => {
            const adapters = passwordManagerHook.result.current.repo.networkSubsystem.adapters;
            expect(adapters.some((a: any) => a.isMockP2P)).toBe(false);
        });
    });
});
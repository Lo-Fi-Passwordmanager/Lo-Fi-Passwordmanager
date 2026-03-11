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

describe("Settings Integration Test ", ()=> {

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

        // test dark mode
        //expect(document.documentElement.classList.contains('dark')).toBe(true);
        act(() => {
            settingsVM.result.current.toggleDarkMode();
        });
        expect(settingsVM.result.current.darkMode).toBe(false);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        act(() => {
            settingsVM.result.current.toggleDarkMode();
        });
        expect(settingsVM.result.current.darkMode).toBe(true);
        //expect(document.documentElement.classList.contains('dark')).toBe(true);

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
    });
});
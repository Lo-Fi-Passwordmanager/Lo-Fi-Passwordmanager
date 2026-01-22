import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useSettingsViewModel} from "../../../src/Components/ViewModels/SettingsViewModel";

describe("SettingsViewModel", () => {

    function setSync(value: boolean) {}

    beforeEach(() => {

    });

    afterEach(() => {

    });

    it("should be able to toggle Dark Mode", () => {
        const {result} = renderHook(() => useSettingsViewModel(setSync));
        expect(result.current.darkMode).toBe(true);
        act(() => {
            result.current.toggleDarkMode();
        });
        expect(result.current.darkMode).toBe(false);
        act(() => {
            result.current.toggleDarkMode();
        });
        expect(result.current.darkMode).toBe(true);
    });

    it("should be able to toggle Synchronisation", () => {
        const {result} = renderHook(() => useSettingsViewModel(setSync));
        expect(result.current.synchronisation).toBe(true);
        act(() => {
            result.current.toggleSynchronisation();
        });
        expect(result.current.synchronisation).toBe(false);
        act(() => {
            result.current.toggleSynchronisation();
        });
        expect(result.current.synchronisation).toBe(true);
    });

    it("should be able to toggle AutoConflictResolution", () => {
        const {result} = renderHook(() => useSettingsViewModel(setSync));
        expect(result.current.autoConflictRes).toBe(true);
        act(() => {
            result.current.toggleAutoConflictRes();
        });
        expect(result.current.autoConflictRes).toBe(false);
        act(() => {
            result.current.toggleAutoConflictRes();
        });
        expect(result.current.autoConflictRes).toBe(true);
    });

    it("should be able to toggle Auto Logout", () => {
        const {result} = renderHook(() => useSettingsViewModel(setSync));
        expect(result.current.timeOutActive).toBe(true);
        act(() => {
            result.current.toggleTimeOutActive();
        });
        expect(result.current.timeOutActive).toBe(false);
        act(() => {
            result.current.toggleTimeOutActive();
        });
        expect(result.current.timeOutActive).toBe(true);
    });
});
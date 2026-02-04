import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useSettingsViewModel} from "../../../src/Components/ViewModels/SettingsViewModel";

describe("SettingsViewModel", () => {
    beforeEach(() => {

    });

    afterEach(() => {

    });

    it("should be able to toggle Dark Mode", () => {
        const {result} = renderHook(() => useSettingsViewModel());
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
        const {result} = renderHook(() => useSettingsViewModel());
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


    it("should be able to toggle Auto Logout", () => {
        const {result} = renderHook(() => useSettingsViewModel());
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

    it('should be able to change auto logout Length correctly', ()=> {
        const {result} = renderHook(() => useSettingsViewModel());
        act(() => {
            result.current.setTimeOutLengthVM("1");
        });
        expect(result.current.timeoutLength).toBe(1);
        act(() => {
            result.current.increaseTimeout();
        });
        expect(result.current.timeoutLength).toBe(2);
        act(() => {
            result.current.decreaseTimeout();
        });
        expect(result.current.timeoutLength).toBe(1);
    })

    it('should never let timeoutLength be below 1', ()=> {
        const {result} = renderHook(() => useSettingsViewModel());
        act(() => {
            result.current.setTimeOutLengthVM("1");
        });
        expect(result.current.timeoutLength).toBe(1);
        act(() => {
            result.current.setTimeOutLengthVM("0");
        });
        expect(result.current.timeoutLength).toBe(1);
        act(() => {
            result.current.decreaseTimeout();
        });
        expect(result.current.timeoutLength).toBe(1);
    })
});
import {describe, expect, it} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useDatabaseSettingsViewModel} from "../../../src/Components/ViewModels/DatabaseSettingsViewModel";

describe('DatabaseSettingsViewModel', () => {
    it('should be able to open the Settings correctly', ()=> {
        const {result} = renderHook(() => useDatabaseSettingsViewModel());
        expect(result.current.settingsOpen).toBe(false);
        act(() => {
            result.current.setSettingsOpen(true);
        })
        expect(result.current.settingsOpen).toBe(true);
        act(() => {
            result.current.setSettingsOpen(false);
        })
        expect(result.current.settingsOpen).toBe(false);
    })
});
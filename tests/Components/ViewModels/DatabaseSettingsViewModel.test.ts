import {describe, expect, it} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useDatabaseSettingsViewModel} from "../../../src/Components/ViewModels/DatabaseSettingsViewModel";

describe('DatabaseSettingsViewModel', () => {
    it('should', ()=> {
        const {result} = renderHook(() => useDatabaseSettingsViewModel());
        expect(result.current.settingsOpen).toBe(false);
        act(() => {
            result.current.setSettingsOpen(true);
        })
        expect(result.current.settingsOpen).toBe(true);
    })
});
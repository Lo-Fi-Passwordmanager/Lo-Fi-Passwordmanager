import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook} from "@testing-library/react";
import useDatabaseSettingsViewModel from "../../../../src/Components/ViewModels/Dialog/DatabaseSettingsViewModel";
import {AutomergeFacade} from "../../../../src/Utility/AutomergeFacade";

describe("DatabaseSettingsViewModel", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined),
            },
        });

        global.URL.createObjectURL = vi.fn(() => 'blob:mock-url-123');
        global.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("should copy the Database ID to clipboard", () => {
        const {result} = renderHook(() => useDatabaseSettingsViewModel({
            automergeURL: "automerge:example-database-id"
        } as any));
        act(() => {
            result.current.copyURLToClipboard();
        });
        expect(result.current.message).toBe("In die Zwischenablage kopiert");
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("example-database-id");
    });

    it("should be able to export the database as file", async () => {
        const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click");

        const exportSpy = vi.spyOn(AutomergeFacade.prototype, 'exportAutomergeToBinary')
            .mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5]));

        const {result} = renderHook(() => useDatabaseSettingsViewModel({
            automergeURL: "automerge:example-database-id",
            exportAutomergeToBinary: exportSpy
        } as any));

        await act(async () => {
            result.current.exportDatabase();
        });

        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalledTimes(1);
        expect(result.current.message).toBe("Erfolgreich exportiert");

        const clickedElement = clickSpy.mock.instances[0] as HTMLAnchorElement;
        expect(clickedElement.href).toContain("blob:mock-url-123");
        expect(clickedElement.download).toMatch(/^ExportierteDatenbank-.*\.encpwdb$/);

        clickSpy.mockRestore();
        exportSpy.mockRestore();
    });
});
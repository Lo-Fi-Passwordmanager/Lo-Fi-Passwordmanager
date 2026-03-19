import {beforeEach, describe, expect, it} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useShareDatabaseQRViewModel} from "../../../../src/Components/ViewModels/Dialog/ShareDatabaseQRViewModel";

describe("ShareQRViewModel", () => {

    beforeEach(() => {
    });

    it("should be able to toggle name sharing", () => {
        const {result} = renderHook(() => useShareDatabaseQRViewModel("Name", "123URL"));
        expect(result.current.shareName).toBe(false);
        act(() => {
            result.current.toggleShareName();
        });
        expect(result.current.shareName).toBe(true);
        act(() => {
            result.current.toggleShareName();
        });
        expect(result.current.shareName).toBe(false);
    });
});
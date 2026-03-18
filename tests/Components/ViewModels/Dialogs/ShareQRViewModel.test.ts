import {describe, it, expect, beforeEach, vi} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useShareQRViewModel} from "../../../../src/Components/ViewModels/Dialog/ShareQRViewModel";

describe('ShareQRViewModel', ()=> {

    beforeEach(() => {
    })

    it('should be able to toggle name sharing', () => {
        const {result} = renderHook(() => useShareQRViewModel("Name", "123URL"));
        expect(result.current.shareName).toBe(false);
        act(() => {
            result.current.toggleShareName()
        });
        expect(result.current.shareName).toBe(true);
        act(() => {
            result.current.toggleShareName()
        });
        expect(result.current.shareName).toBe(false);
    })
})
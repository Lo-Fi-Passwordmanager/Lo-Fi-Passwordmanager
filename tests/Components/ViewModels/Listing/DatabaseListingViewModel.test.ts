import {describe, it, vi, expect, beforeEach} from "vitest";
import {renderHook, waitFor} from "@testing-library/react";
import useDatabaseListingViewModel from "../../../../src/Components/ViewModels/Listing/DatabaseListingViewModel";

describe('DatabaseListingViewModel', () => {
    Object.assign(navigator, {
        clipboard: {
            writeText: vi.fn(),
        },
    });
    beforeEach(() => {
        vi.resetAllMocks();
    })

    it('should be able to copy a string to the clipboard', async ()=> {
        const {result} = renderHook(useDatabaseListingViewModel);
        result.current.copyToClipboard("automerge:test");
        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test");
        })

    })
})
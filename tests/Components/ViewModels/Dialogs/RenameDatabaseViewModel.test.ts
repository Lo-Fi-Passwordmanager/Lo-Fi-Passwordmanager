import {beforeEach, describe, expect, it, vi} from "vitest";
import {renderHook, act, waitFor} from "@testing-library/react";
import {useRenameDatabaseViewModel} from "../../../../src/Components/ViewModels/Dialog/RenameDatabaseViewModel";

describe('RenameDatabaseViewModel', ()=> {
    const oldName: string = "oldName";
    const renameDatabase = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
    })

    it('should be able to rename a database', async () => {
        const {result} = renderHook(() => useRenameDatabaseViewModel(oldName, renameDatabase));
        act(() => {
            result.current.setNewName("newName");
        });
        act(() => {
            result.current.handleConfirm();
        });
        await waitFor(() => {
            expect(renameDatabase).toHaveBeenCalledWith(oldName, "newName");
        })

    })
})
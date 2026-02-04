import {beforeEach, describe, expect, it} from "vitest";
import {AutomergeFacade} from "../../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useHistoryViewModel} from "../../../../src/Components/ViewModels/Dialog/HistoryViewModel";

describe('HistoryViewModel', ()=> {
    let automergeFacade;
    let repo;

    beforeEach(() => {
        repo = new Repo();
        automergeFacade = new AutomergeFacade(repo);
    })
    it('', async () => {
        const {result} = renderHook(() => useHistoryViewModel(automergeFacade));
        expect(result.current.automergeHistory).toBeNull();
        act(() => {
            result.current.setHistoryOpen(true);
        });
        await waitFor(() => {
            //expect(result.current.automergeHistory == null).toBe(false); TODO ist die History null wenn das repo leer ist?
        });
    })
})
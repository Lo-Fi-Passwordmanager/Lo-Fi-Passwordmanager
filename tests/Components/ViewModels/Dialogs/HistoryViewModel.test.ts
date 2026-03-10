import {beforeEach, describe, expect, it, vi} from "vitest";
import {AutomergeFacade} from "../../../../src/Utility/AutomergeFacade";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useHistoryViewModel} from "../../../../src/Components/ViewModels/Dialog/HistoryViewModel";
import {HistoryEntry} from "../../../../src/Model/Automerge/HistoryEntry";
import {AutomergeItem} from "../../../../src/Model/Automerge/AutomergeItem";

describe('HistoryViewModel', ()=> {
    let automergeFacade;

    beforeEach(() => {
        automergeFacade = {
            getHistory: vi.fn(),
        }
    })
    it('should initialize with empty history', () => {
        const {result} = renderHook(() => useHistoryViewModel(automergeFacade as AutomergeFacade));

        expect(result.current.historyOpen).toBe(false);
        expect(result.current.automergeHistory).toBeNull();
    });

    it('should toogle the historyOpen state', () => {
        const {result} = renderHook(() => useHistoryViewModel(automergeFacade as AutomergeFacade));

        act(() => {
            result.current.setHistoryOpen(true);
        });
        expect(result.current.historyOpen).toBe(true);

        act(() => {
            result.current.setHistoryOpen(false);
        });
        expect(result.current.historyOpen).toBe(false);
    });

    it('should call loadHistory and set automergeHistory', async () => {
        const mockHistoryData: HistoryEntry[] = [
            {
                itemId: "123",
                type: "new",
                changes: new Map(),
                item: {} as AutomergeItem,
                oldParent: "",
            },
        ];
        vi.mocked(automergeFacade.getHistory!).mockResolvedValue(mockHistoryData);

        const {result} = renderHook(() => useHistoryViewModel(automergeFacade as AutomergeFacade));

        await act(async () => {
            await result.current.loadHistory();
        });

        expect(automergeFacade.getHistory).toHaveBeenCalled();
        expect(result.current.automergeHistory).toEqual(mockHistoryData);
    });
})
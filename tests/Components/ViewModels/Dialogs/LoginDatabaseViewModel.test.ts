import {beforeEach, describe, vi, it, expect} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useLoginDatabaseViewModel} from "../../../../src/Components/ViewModels/Dialog/LoginDatabaseViewModel";

describe('LoginDatabaseViewModel', ()=> {
    const onConfirm = vi.fn();
    const setToastMessage = vi.fn();
    const setShowToast = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should be able to set Field 1', ()=> {
        const {result} = renderHook(() => useLoginDatabaseViewModel(true, onConfirm, setToastMessage, setShowToast))
        expect(result.current.field1).toBe("");
        act(()=> {
            result.current.setField1("1234")
        })
        expect(result.current.field1).toBe("1234");
    })

    it('should return a toast when no password has been entered',async ()=> {
        const {result} = renderHook(() => useLoginDatabaseViewModel(true, onConfirm, setToastMessage, setShowToast))
        act(()=> {
            result.current.handleConfirm();
        })
        expect(setToastMessage).toHaveBeenCalledTimes(1);
        expect(setShowToast).toHaveBeenCalledTimes(1);
        expect(onConfirm).toHaveBeenCalledTimes(0);
    })

    it('should call onConfirm when a password has been entered',async ()=> {
        const {result} = renderHook(() => useLoginDatabaseViewModel(true, onConfirm, setToastMessage, setShowToast))
        act(()=> {
            result.current.setField1("password");
        })
        act(()=> {
            result.current.handleConfirm();
        })
        expect(setToastMessage).toHaveBeenCalledTimes(0);
        expect(setShowToast).toHaveBeenCalledTimes(0);
        expect(onConfirm).toHaveBeenCalledTimes(1);
    })

    it('should have field1 in its correct default state', ()=> {
        const {result} = renderHook(() => useLoginDatabaseViewModel(false, onConfirm, setToastMessage, setShowToast))
        expect(result.current.field1).toBe("");
    })
})
import {beforeEach, describe, vi, it, expect} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useLoginDatabaseViewModel} from "../../../../src/Components/ViewModels/Dialog/LoginDatabaseViewModel";

describe('LoginDatabaseViewModel', ()=> {
    const onConfirm = vi.fn();
    const setToastMessage = vi.fn();
    const setShowToast = vi.fn();
    /*
    let result: ReturnType<typeof renderHook>;
    let rerender: ReturnType<typeof renderHook>["rerender"];

    beforeEach(() => {
        vi.clearAllMocks();

        result = renderHook(
            ({ isOpen }) =>
                useLoginDatabaseViewModel(
                    isOpen,
                    onConfirm,
                    setToastMessage,
                    setShowToast
                ),
            {
                initialProps: { isOpen: false },
            }
        );
        rerender = result.rerender;
    });
    */
    it('should', ()=> {
        /*
        act(()=> {
            result.current.setField1("1234")
        })
        expect(result.current.field1).toBe("1234");
        act(()=> {
            setIsOpen(true);
        })
        expect(result.current.field1).toBe("");
        */
    })
})
import {beforeEach, describe, expect, it} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {usePasswordGenViewModel} from "../../../../src/Components/ViewModels/Dialog/PasswordGenViewModel";

describe('PasswordGenViewModel' ,()=> {
    const ALL_SYMBOLS = /^[A-Za-z0-9!@$%^&*()<>,?/[\]{}\-=_+]+$/
    const LETTERS_ONLY = /^[a-zA-Z]+$/;
    const NUMBERS_SPECIAL_ONLY = /^[0-9!@$%^&*()<>,?/[\]{}\-=_+]+$/
    let pass: string;

    beforeEach(()=> {

    })

    function newPassword(password: string) {
        pass = password;
    }
    //testing coverage but not checking the result right now
    it('should be able to activate the toast if no symbols are selected',()=> {
        const {result} = renderHook(() => usePasswordGenViewModel(newPassword));
        act(()=> {
            result.current.toggleUppercase();
            result.current.toggleLowercase();
            result.current.toggleSpecial();
            result.current.toggleNumbers();
        })
        expect(result.current.numbers || result.current.uppercase ||
            result.current.lowercase || result.current.special).toBe(false);
        result.current.handleConfirm();
    })

    it('should be able to generate a password from the selected symbols(All)', ()=> {
        const {result} = renderHook(() => usePasswordGenViewModel(newPassword));
        result.current.handleConfirm();
        expect(pass.length).toBe(20);
        expect(pass).toMatch(ALL_SYMBOLS)
    })

    it('should be able to generate a password from the selected symbols(letters Only)',()=> {
        const {result} = renderHook(() => usePasswordGenViewModel(newPassword));
        act(()=> {
            result.current.toggleNumbers();
            result.current.toggleSpecial();
        })
        result.current.handleConfirm();
        expect(pass.length).toBe(20);
        expect(pass).toMatch(LETTERS_ONLY);
    })

    it('should be able to generate a password from the selected symbols(Special/Numbers Only)', ()=> {
        const {result} = renderHook(() => usePasswordGenViewModel(newPassword));
        act(()=> {
            result.current.toggleUppercase();
            result.current.toggleLowercase();
        })
        result.current.handleConfirm();
        expect(pass.length).toBe(20);
        expect(pass).toMatch(NUMBERS_SPECIAL_ONLY);
    })

    it('should be able to return and toggle Uppercase correctly',()=> {
        const {result} = renderHook(() => usePasswordGenViewModel(newPassword))
        expect(result.current.uppercase).toBe(true);
        act(()=> {
            result.current.toggleUppercase();
        })
        expect(result.current.uppercase).toBe(false);
        act(()=> {
            result.current.toggleUppercase();
        })
        expect(result.current.uppercase).toBe(true);
    })

    it('should be able to return and toggle lowercase correctly',()=> {
        const {result} = renderHook(() => usePasswordGenViewModel(newPassword))
        expect(result.current.lowercase).toBe(true);
        act(()=> {
            result.current.toggleLowercase();
        })
        expect(result.current.lowercase).toBe(false);
        act(()=> {
            result.current.toggleLowercase();
        })
        expect(result.current.lowercase).toBe(true);
    })

    it('should be able to return and toggle numbers correctly',()=> {
        const {result} = renderHook(() => usePasswordGenViewModel(newPassword))
        expect(result.current.numbers).toBe(true);
        act(()=> {
            result.current.toggleNumbers();
        })
        expect(result.current.numbers).toBe(false);
        act(()=> {
            result.current.toggleNumbers();
        })
        expect(result.current.numbers).toBe(true);
    })

    it('should be able to return and toggle special correctly',()=> {
        const {result} = renderHook(() => usePasswordGenViewModel(newPassword))
        expect(result.current.lowercase).toBe(true);
        act(()=> {
            result.current.toggleSpecial();
        })
        expect(result.current.special).toBe(false);
        act(()=> {
            result.current.toggleSpecial();
        })
        expect(result.current.special).toBe(true);
    })
})
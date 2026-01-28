import {beforeEach, describe, it, expect} from "vitest";
import {
    useLoadingScreen,
    useLoadingScreenProviderViewModel
} from "../../../src/Components/ViewModels/LoadingScreenProviderViewModel";
import {renderHook} from "@testing-library/react";

describe('LoadingScreenProviderViewModel', ()=> {
    beforeEach(() => {

    });

    it('should ', () => {
        const {result} = renderHook(() => useLoadingScreen());

    });

    it('should ', () => {
        const {result} = renderHook(() => useLoadingScreenProviderViewModel());

    })
})
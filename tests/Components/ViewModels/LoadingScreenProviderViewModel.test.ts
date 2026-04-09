import {beforeEach, describe, it, expect} from "vitest";
import {
    useLoadingScreen,
    useLoadingScreenProviderViewModel
} from "../../../src/Components/ViewModels/Provider/LoadingScreenProviderViewModel";
import {renderHook} from "@testing-library/react";

describe('LoadingScreenProviderViewModel', ()=> {
    beforeEach(() => {

    });

    it('should ', () => {
        const {result} = renderHook(() => useLoadingScreen());

    });

    it('should be able to correctly render the hook of the provider', () => {
        const {result} = renderHook(() => useLoadingScreenProviderViewModel());
        expect(result === null).toBe(false);
    })
})
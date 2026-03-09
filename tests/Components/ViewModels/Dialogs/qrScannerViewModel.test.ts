import {describe, it, expect, beforeEach, afterEach, vi} from "vitest";
import {act, renderHook} from "@testing-library/react";
import useQRScannerViewModel from "../../../../src/Components/ViewModels/Dialog/qrScannerViewModel"
describe('qrScannerViewModel', ()=> {
    let setInputFields;


    vi.mock("qr-scanner", () => {
        class MockQrScanner {
            start = vi.fn();
            stop = vi.fn();
            destroy = vi.fn();

            constructor(
                _video: HTMLVideoElement,
                _callback: (result: any) => void,
                _options?: any
            ) {}
        }

        return { default: MockQrScanner };
    });


    beforeEach(() => {
        setInputFields = vi.fn((name, url) => {})
        const video = document.createElement("video");
        video.id = "qrVideo";
        document.body.appendChild(video);
    })

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it('should react to open change', async () => {
        const {result} = renderHook(() => useQRScannerViewModel(setInputFields));
        expect(result.current.qrScannerOpen).toBe(false);
        act(() => {
            result.current.setQRScannerOpen(true);
        });
        expect(result.current.qrScannerOpen).toBe(true);
        act(() => {
            result.current.setQRScannerOpen(false);
        });
        expect(result.current.qrScannerOpen).toBe(false);
    })


    //Ich glaube da ist nicht mehr mit unittests zu holen. Man müsste halt irgendwie sonst den Feed mocken...
})
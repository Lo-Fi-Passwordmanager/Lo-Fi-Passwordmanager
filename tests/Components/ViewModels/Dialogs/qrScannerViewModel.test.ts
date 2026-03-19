import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook} from "@testing-library/react";
import useDatabaseQRScannerViewModel from "../../../../src/Components/ViewModels/Dialog/DatabaseQRScannerViewModel";
import {isValidAutomergeUrl} from "@automerge/react";
import {Settings} from "../../../../src/Model/Settings";

describe("qrScannerViewModel", () => {

    let setInputFields;
    const {mockScannerState, mockStart} = vi.hoisted(() => {
        return {
            mockScannerState: {callback: null as any},
            mockStart: vi.fn().mockResolvedValue(undefined)
        };
    });
    const setupAndOpenScanner = () => {
        const {result} = renderHook(() => useDatabaseQRScannerViewModel(setInputFields));
        act(() => {
            result.current.setQRScannerOpen(true);
        });
        return result;
    };

    vi.mock("@automerge/react", () => ({
        isValidAutomergeUrl: vi.fn()
    }));

    vi.mock("qr-scanner", () => {
        return {
            default: class MockQrScanner {
                constructor(videoElem: any, callback: any, options: any) {
                    mockScannerState.callback = callback;
                }

                start = mockStart;
                stop = vi.fn();
                destroy = vi.fn();
            }
        };
    });


    beforeEach(() => {
        vi.clearAllMocks();
        setInputFields = vi.fn((name, url) => {
        });
        const video = document.createElement("video");
        video.id = "qrVideo";
        document.body.appendChild(video);
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("should react to open change", async () => {
        const {result} = renderHook(() => useDatabaseQRScannerViewModel(setInputFields));
        expect(result.current.qrScannerOpen).toBe(false);
        act(() => {
            result.current.setQRScannerOpen(true);
        });
        expect(result.current.qrScannerOpen).toBe(true);
        act(() => {
            result.current.setQRScannerOpen(false);
        });
        expect(result.current.qrScannerOpen).toBe(false);
    });

    it("shoud call an eeor if the scan was interrupted", async () => {
        const result = setupAndOpenScanner();
        act(() => {
            mockScannerState.callback(null);
        });
        expect(result.current.scanError).toBe(true);
    });

    it("should call an scan error if the format of the url is invalid", async () => {
        const result = setupAndOpenScanner();
        act(() => {
            mockScannerState.callback({data: "invalid-url-format!"});
        });
        expect(result.current.scanError).toBe(true);
    });

    it("should call an scan error if the url is not a valid automerge url", async () => {
        vi.mocked(isValidAutomergeUrl).mockReturnValue(false);
        const result = setupAndOpenScanner();
        act(() => {
            mockScannerState.callback({data: "iNvAlIdUrL|name|wss://serverurl"});
        });
        expect(isValidAutomergeUrl).toHaveBeenCalledWith("automerge:iNvAlIdUrL");
        expect(result.current.scanError).toBe(true);
    });

    it("should set the input fields and close the scanner if the url is valid", async () => {
        vi.mocked(isValidAutomergeUrl).mockReturnValue(true);
        const result = setupAndOpenScanner();
        act(() => {
            mockScannerState.callback({data: "validUrl|name|wss://serverurl"});
        });
        expect(isValidAutomergeUrl).toHaveBeenCalledWith("automerge:validUrl");
        expect(setInputFields).toHaveBeenCalledWith("name", "validUrl");
        expect(result.current.qrScannerOpen).toBe(false);
        expect(result.current.scanError).toBe(false);
    });

    it("should set the input fields and close the scanner if the url is valid and no name is provided", async () => {
        vi.mocked(isValidAutomergeUrl).mockReturnValue(true);
        const result = setupAndOpenScanner();
        act(() => {
            mockScannerState.callback({data: "validUrl|wss://serverurl"});
        });
        expect(isValidAutomergeUrl).toHaveBeenCalledWith("automerge:validUrl");
        expect(setInputFields).toHaveBeenCalledWith("", "validUrl");
        expect(result.current.qrScannerOpen).toBe(false);
        expect(result.current.scanError).toBe(false);
    });

    it("should fail if no server was provided", async () => {
        vi.mocked(isValidAutomergeUrl).mockReturnValue(true);
        const result = setupAndOpenScanner();
        act(() => {
            mockScannerState.callback({data: "validUrl"});
        });
        expect(result.current.scanError).toBe(true);
    });

    it("should add server", async () => {
        vi.mocked(isValidAutomergeUrl).mockReturnValue(true);
        const result = setupAndOpenScanner();
        act(() => {
            mockScannerState.callback({data: "validUrl|wss://serverurl"});
        });

        const settings = Settings.getSettings();

        expect(settings.getActiveServerUrls()).toContain("wss://serverurl");
    });

});
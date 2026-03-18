import {describe, expect, it, vi} from "vitest";
import {act, renderHook} from "@testing-library/react";
import useAddServerDialogViewModel from "../../../../src/Components/ViewModels/Dialog/AddServerDialogViewModel";

const onAddServer = vi.fn();
const servers = new Map<string, string>();
const serversWithContent = new Map<string, string>([["name", "wss://valid.url"]]);
const onClose = vi.fn();
const setShowToast = vi.fn();
const setToastMessage = vi.fn();

describe("AddServerDialogViewModel", () => {

    it("should recognize an empty name", () => {
        const {result} = renderHook(() => useAddServerDialogViewModel(onAddServer, servers, onClose, setShowToast, setToastMessage));
        act(() => {
            result.current.handleAddServer();
        });
        expect(setToastMessage).toHaveBeenCalledWith("Name und URL dürfen nicht leer sein.");
    });

    it("should recognize an empty url", () => {
        const {result} = renderHook(() => useAddServerDialogViewModel(onAddServer, servers, onClose, setShowToast, setToastMessage));
        act(() => {
            result.current.setName("name");
        });
        act(() => {
            result.current.handleAddServer();
        });
        expect(setToastMessage).toHaveBeenCalledWith("Name und URL dürfen nicht leer sein.");
    });

    it("should recognize an invalid url", () => {
        const {result} = renderHook(() => useAddServerDialogViewModel(onAddServer, servers, onClose, setShowToast, setToastMessage));
        act(() => {
            result.current.setName("name");
            result.current.setUrl("invalid");
        });
        act(() => {
            result.current.handleAddServer();
        });
        expect(setToastMessage).toHaveBeenCalledWith("Invalide URL. Bitte gültige Websocket URL eingeben.");
    });

    it("should add a valid url", () => {
        const {result} = renderHook(() => useAddServerDialogViewModel(onAddServer, servers, onClose, setShowToast, setToastMessage));
        act(() => {
            result.current.setName("name");
            result.current.setUrl("wss://valid.url");
        });
        act(() => {
            result.current.handleAddServer();
        });
        expect(onAddServer).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it("should recognize duplicate server names", () => {
        const {result} = renderHook(() => useAddServerDialogViewModel(onAddServer, serversWithContent, onClose, setShowToast, setToastMessage));
        act(() => {
            result.current.setName("name");
            result.current.setUrl("wss://valid.url");
        });
        act(() => {
            result.current.handleAddServer();
        });
        expect(setToastMessage).toHaveBeenCalledWith("Ein Server mit diesem Namen existiert bereits.");
    });

    it("should recognize duplicate server urls", () => {
        const {result} = renderHook(() => useAddServerDialogViewModel(onAddServer, serversWithContent, onClose, setShowToast, setToastMessage));
        act(() => {
            result.current.setName("name2");
            result.current.setUrl("wss://valid.url");
        });
        act(() => {
            result.current.handleAddServer();
        });
        expect(setToastMessage).toHaveBeenCalledWith("Ein Server mit dieser URL existiert bereits.");
    });
});
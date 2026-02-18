import AddServerDialogViewModel from "../../../../src/Components/ViewModels/Dialog/AddServerDialogViewModel";
import {it, describe, vi, expect} from "vitest";
import {act, renderHook} from "@testing-library/react";
import useAddServerDialogViewModel from "../../../../src/Components/ViewModels/Dialog/AddServerDialogViewModel";

const onAddServer = vi.fn();
const onClose = vi.fn();
const setShowToast = vi.fn();
const setToastMessage = vi.fn();

describe('AddServerDialogViewModel', ()=> {

    it('should recognize an empty name', ()=> {
        const { result } = renderHook(() => useAddServerDialogViewModel(onAddServer, onClose, setShowToast, setToastMessage));
        act(() => {
            result.current.handleAddServer();
        });
        expect(setToastMessage).toHaveBeenCalledWith("Name und URL dürfen nicht leer sein!");
    });

    it('should recognize an empty url', ()=> {
        const { result } = renderHook(() => useAddServerDialogViewModel(onAddServer, onClose, setShowToast, setToastMessage));
        act(() => {
            result.current.setName("name");
        })
        act(() => {
            result.current.handleAddServer();
        });
        expect(setToastMessage).toHaveBeenCalledWith("Name und URL dürfen nicht leer sein!");
    });

    it('should recognize an invalid url', ()=> {
        const { result } = renderHook(() => useAddServerDialogViewModel(onAddServer, onClose, setShowToast, setToastMessage));
        act(() => {
            result.current.setName("name");
            result.current.setUrl("invalid")
        })
        act(() => {
            result.current.handleAddServer();
        });
        expect(setToastMessage).toHaveBeenCalledWith("Invalide URL! Bitte gültige Websocket URL eingeben.");
    });

    it('should add a valid url', ()=> {
        const { result } = renderHook(() => useAddServerDialogViewModel(onAddServer, onClose, setShowToast, setToastMessage));
        act(() => {
            result.current.setName("name");
            result.current.setUrl("wss://valid.url")
        })
        act(() => {
            result.current.handleAddServer();
        });
        expect(onAddServer).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    })
})
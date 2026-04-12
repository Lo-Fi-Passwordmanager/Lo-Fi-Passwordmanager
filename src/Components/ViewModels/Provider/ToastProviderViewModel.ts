import {type Context, createContext, useContext, useState} from "react";

/**
 * Show a toast with a message.
 * @param message the message to display in the toast.
 * @param timeout the time in ms after which the toast should vanish, default value is 3000ms. If set to -1 toast is shown until hide() is called
 * @return a callback function to hide that toast.
 */
type ToastContext = [(message: string, timeout?: number) => number, (id: number) => void]


export const ToastProviderContext: Context<ToastContext> = createContext([(_message) => -1, (_id) => {}]);

export function useToast() {
    const context = useContext(ToastProviderContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

type Toast = {
    message: string,
    timeout: number,
    id: number
}

export const useToastProviderViewModel = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [highestIndex, setHighestIndex] = useState<number>(0)

    /**
     * Show a toast with a message.
     * @param message the message to display in the toast.
     * @param timeout the time in ms after which the toast should vanish, default value is 3000ms. If set to -1 toast is shown until remove() function is called.
     * @return the id of the created toast.
     */
    function showToast(message: string, timeout?: number): number {
        timeout = timeout ?? 3000;
        setHighestIndex(highestIndex + 1)
        const newToast = {message: message, timeout: timeout, id: highestIndex}
        setToasts(oldToasts => [...oldToasts, newToast])

        if (timeout >= 0) {
            setTimeout(() => {
                removeToast(highestIndex)
            }, timeout)
        }

        return highestIndex
    }

    function removeToast(id: number) {
        setToasts(oldToasts => oldToasts.filter(toast => toast.id != id));
        let idx = 0;
        toasts.forEach(toast => {if (toast.id > idx) {idx = toast.id}})
        setHighestIndex(idx)
    }

    return {
        toasts,
        showToast,
        removeToast
    };
};
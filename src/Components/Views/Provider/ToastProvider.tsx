import React from "react";

import {ToastProviderContext, useToastProviderViewModel} from "../../ViewModels/Provider/ToastProviderViewModel.ts";

/**
 * The provider for the toast context. It provides the ability to show and hide toasts anywhere.
 * @param children the children components
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const viewModel = useToastProviderViewModel();

    return (
        <ToastProviderContext.Provider value={[viewModel.showToast, viewModel.removeToast]}>
            <div className={"toastContainer"}>
                {viewModel.toasts.map((toast, index) => {
                    return (<div className="floatingToast" key={index}>{toast.message}</div>)
                }).reverse()}
            </div>

            {children}
        </ToastProviderContext.Provider>
    );
};
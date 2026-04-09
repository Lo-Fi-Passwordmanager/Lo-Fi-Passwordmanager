import {useToast} from "../Provider/ToastProviderViewModel.ts";

const useDatabaseListingViewModel = () => {

    const [showToast, _] = useToast()
    /**
     * Copies the given URL to the clipboard, removing the "automerge:" prefix and shows a toast notification
     */
    function copyToClipboard(url: string) {
        showToast("Datenbank ID in die Zwischenablage kopiert!")
        void navigator.clipboard.writeText(url.replace("automerge:", ""));
    }

    return {
        copyToClipboard
    }
}
export default useDatabaseListingViewModel;
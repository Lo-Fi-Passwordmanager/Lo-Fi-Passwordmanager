import {useState} from "react";

const useDatabaseListingViewModel = () => {
    const [showToast, setShowToast] = useState(false);

    /**
     * Copies the given URL to the clipboard, removing the "automerge:" prefix and shows a toast notification
     */
    function copyToClipboard(url: string) {
        setShowToast(true);
        void navigator.clipboard.writeText(url.replace("automerge:", ""));
    }

    return {
        copyToClipboard,
        showToast,
        setShowToast
    }
}
export default useDatabaseListingViewModel;
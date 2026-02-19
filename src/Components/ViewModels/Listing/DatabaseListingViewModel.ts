import {useState} from "react";

const useDatabaseListingViewModel = () => {
    const [showToast, setShowToast] = useState(false);

    /**
     * Copies the given URL to the clipboard, removing the "automerge:" prefix
     * and shows a toast notification
     */
    const copyToClipboard = async (url: string) => {
        await navigator.clipboard.writeText(url.replace("automerge:", ""));
        setShowToast(true);
    };

    return {
        copyToClipboard,
        showToast,
        setShowToast
    }
}
export default useDatabaseListingViewModel;
import {useTranslation} from "react-i18next";

import {useToast} from "../Provider/ToastProviderViewModel.ts";

const useDatabaseListingViewModel = () => {

    const [showToast, _] = useToast()
    const {t} = useTranslation();
    /**
     * Copies the given URL to the clipboard, removing the "automerge:" prefix and shows a toast notification
     */
    function copyToClipboard(url: string) {
        showToast(t("common.copied_clipboard"))
        void navigator.clipboard.writeText(url.replace("automerge:", ""));
    }

    return {
        copyToClipboard
    }
}
export default useDatabaseListingViewModel;
import React, {useEffect, useState} from "react";

interface TwoFieldDialogProps {
    isOpen: boolean,
    title: string,
    label1: string,
    onConfirm: (field1: string) => void,
    onCancel: () => void,
    setToastMessage: (message: string) => void,
    setShowToast: (message: boolean) => void,
}

const LoginDatabaseDialog: React.FC<TwoFieldDialogProps> = ({
    isOpen,
    title,
    label1,
    onConfirm,
    onCancel,
    setToastMessage,
    setShowToast

}) => {

    const [field1, setField1] = useState("");

    useEffect(() => {
        if (isOpen) {
            setField1("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!field1) {
            setToastMessage("Bitte ein Password eingeben.");
            setShowToast(true);
            return;
        }
        onConfirm(field1);
    };

    return (
        <div className="dialogOverlay">
            <div className="dialog">
                <h3>{title}</h3>
                <label>{label1}</label>
                <input
                    type="password"
                    value={field1}
                    onChange={(e) => setField1(e.target.value)}
                    placeholder={label1}
                    autoFocus
                />

                <div className="confirm-cancel-buttons">
                    <button onClick={handleConfirm}>Bestätigen</button>
                    <button onClick={onCancel}>Abbrechen</button>
                </div>

            </div>
        </div>
    );
};
export default LoginDatabaseDialog;
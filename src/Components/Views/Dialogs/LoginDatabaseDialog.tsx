import React, {useState, useEffect} from "react";

interface TwoFieldDialogProps {
    isOpen: boolean,
    title: string,
    label1: string,
    onConfirm: (field1: string) => void,
    onCancel: () => void,
}

const LoginDatabaseDialog: React.FC<TwoFieldDialogProps> = ({
                                                                isOpen,
                                                                title,
                                                                label1,
                                                                onConfirm,
                                                                onCancel,

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
            alert("Bitte alle Felder ausfüllen.");
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
                    className={"inputField"}
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
    )
}
export default LoginDatabaseDialog;
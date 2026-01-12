import React, {useState, useEffect} from "react";
import OnClickButton from "../ButtonViews/OnClickButton.tsx";
import {dialogOverlayStyle, dialogStyle} from "../CSS.ts";

interface TwoFieldDialogProps {
    isOpen: boolean;
    title: string;
    label1: string;
    label2: string;
    onConfirm: (field1: string, field2: string) => void;
    onCancel: () => void;
}

const TwoFieldDialog: React.FC<TwoFieldDialogProps> = ({
    isOpen,
    title,
    label1,
    label2,
    onConfirm,
    onCancel
}) => {

    const [field1, setField1] = useState("");
    const [field2, setField2] = useState("");

    useEffect(() => {
        if (isOpen) {
            setField1("");
            setField2("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!field1 || !field2) {
            alert("Bitte alle Felder ausfüllen.");
            return;
        }
        onConfirm(field1, field2);
    };

    return (
        <div style={dialogOverlayStyle}>
            <div style={dialogStyle}>
                <h3>{title}</h3>
                <label>{label1}</label>
                <input
                    type="text"
                    value={field1}
                    onChange={(e) => setField1(e.target.value)}
                    placeholder={label1}
                    autoFocus
                />

                <label>{label2}</label>
                <input
                    type="password"
                    value={field2}
                    onChange={(e) => setField2(e.target.value)}
                    placeholder={label2}
                />

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <OnClickButton onClick={handleConfirm}>Bestätigen</OnClickButton>
                    <OnClickButton onClick={onCancel}>Abbrechen</OnClickButton>
                </div>
            </div>
        </div>
    )
}
export default TwoFieldDialog;
import React, {useState, useEffect} from "react";
import OnClickButton from "../ButtonViews/OnClickButton.tsx";

interface TwoFieldDialogProps {
    isOpen: boolean;
    title: string;
    label1: string;
    label2: string;
    onConfirm: (field1: string, field2: string) => void;
    onCancel: () => void;
}

const CreateDatabaseDialog: React.FC<TwoFieldDialogProps> = ({
                                                                 isOpen,
                                                                 title,
                                                                 label1,
                                                                 label2,
                                                                 onConfirm,
                                                                 onCancel
                                                             }) => {

    const [createNewDatabase, setCreateNewDatabase] = useState(true);
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
        if (!createNewDatabase) {
            if (!field1 || !field2) {
                alert("Bitte alle Felder ausfüllen.");
                return;
            }
            onConfirm(field1, field2);
        } else {
            //FIXME hier logik um Datenbank von URL zu laden
            if (!field1) {
                alert("Bitte alle Felder ausfüllen.");
                return;
            }
        }

    };

    if (createNewDatabase) {
        return (
            <div className="dialogOverlay">
                <div className="dialog">
                    <button onClick={() => setCreateNewDatabase(false)}>Existierende Datenbank laden</button>
                    <h3>{title}</h3>
                    <label>{label1}</label>
                    <input
                        className="inputField"
                        type="text"
                        value={field1}
                        onChange={(e) => setField1(e.target.value)}
                        placeholder={label1}
                        autoFocus
                    />

                    <label>{label2}</label>
                    <input
                        className="inputField"
                        type="password"
                        value={field2}
                        onChange={(e) => setField2(e.target.value)}
                        placeholder={label2}
                    />
                    <div className="confirm-cancel-buttons">
                        <OnClickButton onClick={handleConfirm}>Bestätigen</OnClickButton>
                        <OnClickButton onClick={onCancel}>Abbrechen</OnClickButton>
                    </div>
                </div>
            </div>
        );
    } else {
        return(
            <div className="dialogOverlay">
                <div className="dialog">
                    <button onClick={() => setCreateNewDatabase(true)}>Neue Datenbank erstellen</button>
                    <h3>Existierende Datenbank laden</h3>
                    <label>Automerge Url</label>
                    <input
                        className="inputField"
                        type="text"
                        value={field1}
                        onChange={(e) => setField1(e.target.value)}
                        placeholder={"Automerge Url"}
                        autoFocus
                    />
                    <div className="confirm-cancel-buttons">
                        <OnClickButton onClick={handleConfirm}>Bestätigen</OnClickButton>
                        <OnClickButton onClick={onCancel}>Abbrechen</OnClickButton>
                    </div>
                </div>
            </div>
        );
    }

}
export default CreateDatabaseDialog;
import React, {useState, useEffect} from "react";
import type {AutomergeUrl} from "@automerge/automerge-repo";

interface TwoFieldDialogProps {
    isOpen: boolean,
    title: string,
    label1: string,
    label2: string,
    createDatabase: (field1: string, field2: string) => void,
    onCancel: () => void,
    storeDatabase: (name: string, autoMergeUrl: AutomergeUrl) => void
}

const CreateDatabaseDialog: React.FC<TwoFieldDialogProps> = ({
                                                                 isOpen,
                                                                 title,
                                                                 label1,
                                                                 label2,
                                                                 createDatabase,
                                                                 onCancel,
                                                                 storeDatabase
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
        if (!field1 || !field2) {
            alert("Bitte alle Felder ausfüllen.");
            return;
        }
        if (createNewDatabase) {
            createDatabase(field1, field2);
        } else {
            storeDatabase(field1, ("automerge:" + field2) as AutomergeUrl);
            return;
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
                        <button onClick={handleConfirm}>Bestätigen</button>
                        <button onClick={onCancel}>Abbrechen</button>
                    </div>
                </div>
            </div>
        );



    } else {
        return (
            <div className="dialogOverlay">
                <div className="dialog">
                    <button onClick={() => setCreateNewDatabase(true)}>Neue Datenbank erstellen</button>
                    <h3>Existierende Datenbank laden</h3>
                    <label>Name</label>
                    <input
                        className="inputField"
                        type="text"
                        value={field1}
                        onChange={(e) => setField1(e.target.value)}
                        placeholder={"Name"}
                        autoFocus
                    />
                    <label>Automerge Url</label>
                    <input
                        className="inputField"
                        type="text"
                        value={field2}
                        onChange={(e) => setField2(e.target.value)}
                        placeholder={"Automerge Url"}
                        autoFocus
                    />
                    <div className="confirm-cancel-buttons">
                        <button onClick={handleConfirm}>Bestätigen</button>
                        <button onClick={onCancel}>Abbrechen</button>
                    </div>
                </div>
            </div>
        );
    }

}
export default CreateDatabaseDialog;
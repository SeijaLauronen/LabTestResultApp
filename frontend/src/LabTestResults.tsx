// SL 202511: LabTestResults component: Add and view lab test results

import React, { useState } from "react";
import { LabResult } from "./api/labresults";
import { LabResultsTable } from "./components/LabResultsTable";
import { LabResultForm } from "./components/LabResultForm";
import { getLabResults } from "./api/labresults";
import { Tabs } from "./components/Tabs";

const LabTestResults: React.FC = () => {

    const [personId, setPersonId] = useState("");
    const [results, setResults] = useState<LabResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newResults, setNewResults] = useState<LabResult[]>([]);
    const [activeTab, setActiveTab] = useState<"results" | "edit" | "import">("results");
    const [selectedResultIds, setSelectedResultIds] = useState<number[]>([]);


    // 🔹 Haku henkilön tunnuksella
    const handleSearch = async () => {
        if (!personId.trim()) {
            setError("Anna henkilön tunnus!");
            return;
        }
        try {
            setError(null);
            setLoading(true);
            const data = await getLabResults(personId);
            setResults(data);
        } catch (err) {
            setError("Tulosten haku epäonnistui");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ padding: "2rem", fontFamily: "Arial" }}>
            <h1>🧪 Laboratoriotulokset</h1>

            {/* 🔹 Haku henkilön tunnuksella */}
            <div style={{ marginBottom: "1rem" }}>
                <label style={{ marginRight: "0.5rem" }}>Henkilön tunnus:</label>
                <input
                    type="text"
                    value={personId}
                    onChange={(e) => setPersonId(e.target.value)}
                    placeholder="Anna henkilön tunnus"
                    style={{ marginRight: "0.5rem" }}
                />
                <button onClick={handleSearch}>Hae tulokset</button>

            </div>


            <Tabs
                active={activeTab}
                onChange={setActiveTab}
                tabs={[
                    { key: "results", label: "Hakutulokset" },
                    { key: "edit", label: "Lisää / Muokkaa" },
                    { key: "import", label: "Massatuonti" }
                ]}
            />



            {activeTab === "results" && (
                <LabResultsTable
                    personId={personId}
                    results={results}
                    onSelectionChange={(ids) => setSelectedResultIds(ids)}
                    onEditSelected={(rows) => {
                        setNewResults(rows);
                        setActiveTab("edit");      // 🔵 siirrytään edit-välilehdelle
                    }}
                    onCopySelected={(rows) => {
                        const copies = rows.map(r => ({
                            ...r,
                            ID: undefined,       // uusi rivi → ei ID:tä
                            SampleDate: new Date().toISOString().slice(0, 16),
                            ResultAddedDate: "",
                        }));
                        setNewResults(copies);
                        setActiveTab("edit");
                    }}
                />
            )}

            {activeTab === "edit" && (
                <LabResultForm
                    personId={personId}
                    results={newResults}
                //onAdd={() => addNewResult()}           // lisää uusi rivi
                /*
                onSave={(savedRows) => {
                    fetchResults(personId);            // hae freshit
                    setActiveTab("results");           // 🔵 palaa tuloksiin
                }}
                    */
                />
            )}


            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* 🔹 Tulostaulukko */}
            {loading ? (
                <p>Ladataan...</p>
            ) : results.length > 0 ? (
                <></>
            ) : (
                <p>Ei tuloksia haettu.</p>
            )}

            <hr style={{ margin: "2rem 0" }} />

        </div>
    );
};

export default LabTestResults;

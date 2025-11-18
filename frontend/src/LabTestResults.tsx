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
    //const [selectedIds, setSelectedIds] = useState<number[]>([]); // SL 20251115 tämä turhaan, tuo ylempi käy
    const [formRows, setFormRows] = useState<LabResult[]>([]); // SL 20251115


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

    // SL 20251115
    const handleEditSelected = () => {
        const selected = results.filter(r => selectedResultIds.includes(r.ID!));
        setFormRows(selected);
        setActiveTab("edit");
    };

    // SL 20251115
    const handleCopySelectedXX = () => {
        const selected = results
            .filter(r => selectedResultIds.includes(r.ID!))
            .map(r => ({ ...r, ID: null }));   // uusi rivi
        //setFormRows(selected); // tähän ei käy, koska voi olla null
        setActiveTab("edit");
    };

    const handleCopySelected = () => {
        const selected = results
            .filter(r => selectedResultIds.includes(r.ID!)) // TODO Tutki mitä tämä tarkoittaa ja tekee
            .map(r => ({
                ...r,
                ID: undefined,
                SampleDate: new Date().toISOString().slice(0, 16),
                ResultAddedDate: "",
            }));   // uusi rivi
        setFormRows(selected); // tämä valitti, jos oli null!
        setActiveTab("edit");
    };

    // SL 20251115 korjasin tämän itse näin, mutta ei taida valita niitä rivejä oikein...?:
    const handleCopySelectedXY = () => {
        const selected = results.map(r => ({
            ...r,
            ID: undefined,       // uusi rivi → ei ID:tä
            SampleDate: new Date().toISOString().slice(0, 16),
            ResultAddedDate: "",
        }));
        setFormRows(selected);
        setActiveTab("edit");
    }

    // SL 20251115 kun tallennettu formista
    const handleSave = (saved: LabResult[]) => {
        alert("handleSave");
        console.log(saved);
        // päivitetään hakutulokset: päivitä/korvaa lisätyt
        const updated = [...results];

        saved.forEach(row => {
            const i = updated.findIndex(r => r.ID === row.ID);
            if (i >= 0) updated[i] = row;
            else updated.push(row);
        });

        setResults(updated);
        setFormRows([]);
        setSelectedResultIds([]);
        setActiveTab("results");
    };

    // SL 20251118 kun poistettu hakutulostabilla
    const handleDeleteSelected = () => {
        //alert("handleDelete");
        setFormRows([]);
        setSelectedResultIds([]);
        handleSearch();
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
                    onChange={(e) => {
                        setPersonId(e.target.value)
                        // 🔹 Tyhjennä aiemmat tulokset
                        setResults([]);
                        setSelectedResultIds([]);
                        setFormRows([]);
                    }}
                    placeholder="Anna henkilön tunnus"
                    style={{ marginRight: "0.5rem" }}
                />
                {/*<button onClick={handleSearch}>Hae tulokset</button> */}

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
                    onSearch={handleSearch}
                    selectedIds={selectedResultIds}
                    // onSelectionChange={(ids) => setSelectedResultIds(ids)} // TÄMÄ EI OK!! muuttuisi kesken renderöinnin
                    onSelectionChange={setSelectedResultIds}  // NYT OK
                    onEditSelected={handleEditSelected}
                    onCopySelected={handleCopySelected}
                    onDeleteSelected={handleDeleteSelected}
                />
            )}

            {activeTab === "edit" && (
                <LabResultForm
                    personId={personId}
                    results={formRows}
                    onSave={handleSave}
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

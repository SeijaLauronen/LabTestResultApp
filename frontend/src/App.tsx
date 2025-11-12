// SL 202511: Main application component

import React, { useState } from "react";
import { LabResult } from "./api/labresults";
import { LabResultsTable } from "./components/LabResultsTable";
import { LabResultForm } from "./components/LabResultForm";
import { getLabResults } from "./api/labresults";

const App: React.FC = () => {
  const [personId, setPersonId] = useState("");
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // 🔹 Kun lisätään uusi tulos
  const handleAdd = (newResult: LabResult) => {
    setResults((prev) => [...prev, newResult]);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🧪 Laboratoriotulokset</h1>

      {/* 🔹 Haku henkilön tunnuksella */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          placeholder="Anna henkilön tunnus"
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={handleSearch}>Hae</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔹 Tulostaulukko */}
      {loading ? (
        <p>Ladataan...</p>
      ) : results.length > 0 ? (
        <LabResultsTable personId={personId} results={results} onSelectionChange={(sel)=>console.log("selected", sel)} />
      ) : (
        <p>Ei tuloksia haettu.</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* 🔹 Lomake uuden tuloksen lisäykseen */}
      <h2>Lisää uusi tulos</h2>
      <LabResultForm onAdd={handleAdd} />
    </div>
  );
};

export default App;

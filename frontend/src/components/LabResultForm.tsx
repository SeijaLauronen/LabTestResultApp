// SL 202511: Lab result form component for adding new results
import React, { useState } from "react";
import { LabResult, addLabResult } from "../api/labresults";

interface Props {
  onAdd?: (newResult: LabResult) => void;
}

export const LabResultForm: React.FC<Props> = ({ onAdd }) => {
  const [form, setForm] = useState<LabResult>({ PersonID: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newResult = await addLabResult(form);
    onAdd?.(newResult);
    setForm({ PersonID: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="PersonID"
        placeholder="Henkilön ID"
        value={form.PersonID}
        onChange={handleChange}
        required
      />
      <input
        name="AnalysisName"
        placeholder="Analyysin nimi"
        value={form.AnalysisName || ""}
        onChange={handleChange}
      />
      <input
        name="Result"
        placeholder="Tuloksen arvo"
        value={form.Result || ""}
        onChange={handleChange}
      />
      <button type="submit">Lisää</button>
    </form>
  );
};

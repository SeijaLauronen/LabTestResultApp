// SL 202511: Horizontal layout component for displaying lab test results
// src/components/LabTestResultHorizontal.tsximport React, { useState } from "react";
import React, { useState } from "react";
import { LabResult } from "../api/labresults";
import { labResultFields } from "../definitions/fieldDefinitions";

interface Props {
  data: LabResult[];
  onSelectionChange?: (selectedIndices: number[]) => void;
  onSort?: (key: string) => void;
}

export const LabTestResultTableHorizontal: React.FC<Props> = ({
  data,
  onSelectionChange,
  onSort,
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSelect = (index: number) => {
    let newSelected: number[];
    if (selected.includes(index)) {
      newSelected = selected.filter((i) => i !== index);
    } else {
      newSelected = [...selected, index];
    }
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSort = (key: string) => {
    const asc = sortKey === key ? !sortAsc : true;
    setSortKey(key);
    setSortAsc(asc);
    onSort?.(key);
  };

  const sortedData = [...data];
  if (sortKey) {
    sortedData.sort((a, b) => {
      const va = a[sortKey as keyof LabResult] ?? "";
      const vb = b[sortKey as keyof LabResult] ?? "";
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th></th>
          {labResultFields.map((field) => (
            <th
              key={field.key}
              style={{ cursor: field.sortable ? "pointer" : "default", padding: "0.5rem", border: "1px solid #ccc" }}
              onClick={() => field.sortable && handleSort(field.key)}
            >
              {field.label} {sortKey === field.key ? (sortAsc ? "↑" : "↓") : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, idx) => (
          <tr key={idx} style={{ backgroundColor: selected.includes(idx) ? "#eef" : undefined }}>
            <td>
              <input
                type="checkbox"
                checked={selected.includes(idx)}
                onChange={() => toggleSelect(idx)}
              />
            </td>
            {labResultFields.map((field) => (
              <td key={field.key} style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                {row[field.key as keyof LabResult] ?? ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

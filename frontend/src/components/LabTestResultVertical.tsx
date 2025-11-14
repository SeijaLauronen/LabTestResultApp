// SL 202511: Vertical layout component for editing lab test results
// src/components/LabTestResultVertical.tsximport React from "react";
import { LabResult } from "../api/labresults";
import { labResultFields } from "../definitions/fieldDefinitions";

interface Props {
  data: LabResult[];
  onFieldChange: (rowIndex: number, key: string, value: any) => void;
  onDelete: (rowIndex: number) => void;
}

export const LabTestResultTableVertical: React.FC<Props> = ({
  data,
  onFieldChange,
  onDelete,
}) => {
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <tbody>
        {/* Header row with delete buttons */}
        <tr>
          <th></th>
          {data.map((_, idx) => (
            <th key={idx} style={{ textAlign: "center" }}>
              <button onClick={() => onDelete(idx)}>Poista</button>
            </th>
          ))}
        </tr>

        {labResultFields.map((field) => (
          <tr key={field.key}>
            <th style={{ textAlign: "left", paddingRight: "0.5rem" }}>{field.label}</th>
            {data.map((row, idx) => (
              <td key={idx} style={{ padding: "0.25rem 0.5rem" }}>
                <input
                  type={field.type || "text"}
                  value={row[field.key as keyof LabResult] ?? ""}
                  onChange={(e) => onFieldChange(idx, field.key, e.target.value)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

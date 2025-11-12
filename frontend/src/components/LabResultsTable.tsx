// SL 202511: Lab results table component
import React, { useMemo, useState } from "react";
import { labResultFields, LabField } from "../definitions/fieldDefinitions";
import { LabResult } from "../api/labresults";

interface Props {
    personId: string;
    results: LabResult[];
    onSelectionChange?: (selectedIds: number[]) => void;
}

export const LabResultsTable: React.FC<Props> = ({ personId, results, onSelectionChange }) => {
    const [sortKey, setSortKey] = useState<string | null>("SampleDate");
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSort = (key: string) => {
        if (sortKey === key) setSortAsc(!sortAsc);
        else {
            setSortKey(key);
            setSortAsc(true);
        }
    };

    const sortedResults = useMemo(() => {
        if (!sortKey) return results;
        const r = [...results].sort((a: any, b: any) => {
            const va = a[sortKey];
            const vb = b[sortKey];
            if (va == null && vb == null) return 0;
            if (va == null) return 1;
            if (vb == null) return -1;
            // try numeric compare first
            const na = parseFloat(va);
            const nb = parseFloat(vb);
            if (!isNaN(na) && !isNaN(nb)) {
                return na < nb ? -1 : na > nb ? 1 : 0;
            }
            // fallback string/locale compare
            return String(va).localeCompare(String(vb));
        });
        return sortAsc ? r : r.reverse();
    }, [results, sortKey, sortAsc]);

    const toggleRow = (id?: number) => {
        if (id == null) return;
        setSelectedIds((prev) => {
            const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
            onSelectionChange?.(next);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedIds.length === sortedResults.length) {
            setSelectedIds([]);
            onSelectionChange?.([]);
        } else {
            const all = sortedResults.map((r) => r.ID!).filter(Boolean) as number[];
            setSelectedIds(all);
            onSelectionChange?.(all);
        }
    };

    if (!results || results.length === 0) return <p>Ei tuloksia.</p>;

    return (
        <table style={{ width: "100%", borderCollapse: "collapse" }} border={1} cellPadding={6}>
            <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            checked={selectedIds.length === sortedResults.length && sortedResults.length > 0}
                            onChange={toggleAll}
                        />
                    </th>
                    {labResultFields.map((field: LabField) => (
                        <th
                            key={field.key}
                            onClick={() => field.sortable && handleSort(field.key)}
                            style={{ cursor: field.sortable ? "pointer" : "default", userSelect: "none" }}
                        >
                            {field.label}
                            {sortKey === field.key && (sortAsc ? " ▲" : " ▼")}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedResults.map((row) => (
                    <tr key={row.ID}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(row.ID!)}
                                onChange={() => toggleRow(row.ID)}
                            />
                        </td>
                        {labResultFields.map((field: LabField) => (
                            <td key={field.key}>
                                {/* PersonID näytetään vain yhdessä kentässä (sen logiikan voi lisätä täällä) */}
                                {field.key === "PersonID" ? personId : (row as any)[field.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
// SL 202511: Lab results table component
import React, { useMemo, useState } from "react";
import { labResultFields, LabField } from "../definitions/fieldDefinitions";
import { deleteLabResult, LabResult } from "../api/labresults";
import { ReadOnlyField } from "./ReadOnlyField";


// TODO
/* 
The specified value "2025-11-14T07:00:00.000Z" does not conform to the required format.  
The format is "yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS".
*/

interface Props {
    personId: string;
    results: LabResult[];
    onSearch: () => void;
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    onEditSelected?: (rows: LabResult[]) => void;
    onCopySelected?: (rows: LabResult[]) => void;
    onDeleteSelected?: (rows: LabResult[]) => void;
}

export const LabResultsTable: React.FC<Props> = ({
    personId,
    results,
    onSearch,
    selectedIds,
    onSelectionChange,
    onEditSelected,
    onCopySelected,
    onDeleteSelected
}) => {

    // ---------------------------------------
    //  SORT LOGIC
    // ---------------------------------------
    const [sortKey, setSortKey] = useState<string | null>("SampleDate");
    const [sortAsc, setSortAsc] = useState<boolean>(true);

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

            // numeric first
            const na = parseFloat(va);
            const nb = parseFloat(vb);
            if (!isNaN(na) && !isNaN(nb)) {
                return na - nb;
            }

            // string compare fallback
            return String(va).localeCompare(String(vb));
        });
        return sortAsc ? r : r.reverse();
    }, [results, sortKey, sortAsc]);

    // ---------------------------------------
    //  SELECTION LOGIC — SAFE VERSION
    // ---------------------------------------

    const toggleRow = (id?: number) => {
        if (id == null) return;

        const next = selectedIds.includes(id)
            ? selectedIds.filter((x) => x !== id)
            : [...selectedIds, id];

        onSelectionChange(next); // SAFE — happens in event handler
    };

    const toggleAll = () => {
        if (selectedIds.length === sortedResults.length) {
            onSelectionChange([]);
        } else {
            const allIds = sortedResults
                .map((r) => r.ID!)
                .filter(Boolean) as number[];

            onSelectionChange(allIds);
        }
    };

    // ---------------------------------------
    //  ACTION BUTTONS
    // ---------------------------------------

    const selectedRows = results.filter(r => selectedIds.includes(r.ID as number));

    // SL 20251117
    const fetchResults = () => {
        onSearch();
    }

    const editSelected = () => {
        if (selectedRows.length === 0) return;
        onEditSelected?.(selectedRows);
    };

    const copySelected = () => {
        if (selectedRows.length === 0) return;
        onCopySelected?.(selectedRows);
    };

    // TODO tähän tarkemmin paluuarvot ja niiden käsittely
    const deleteSelected = async () => {
        if (selectedRows.length === 0) return;
        // alert("Poisto toteutetaan myöhemmin!");

        // Käydään läpi jokainen rivi
        const deleted: LabResult[] = [];

        try {
            for (const row of selectedRows) {
                console.log("Poistetaan rivi:", row);
                // Poistetaan rivi → DELETE                
                const res = await deleteLabResult(row.ID as number);
                deleted.push(row as LabResult);
            }

            console.log("Poisto valmis:", deleted);

            onDeleteSelected?.(deleted);   // kerrotaan parentille että poisto ok

            //alert("Poistettu!");
        } catch (err: any) {
            console.error("👉 Virhe poistossa", err);

            if (err.response) {
                alert(
                    "Virhe poistossa (server): "
                    + err.response.status
                    + " - "
                    + JSON.stringify(err.response.data)
                );
            } else {
                alert("Virhe poistossa (client): " + err.message);
            }
        }

        //onDeleteSelected?.(selectedRows);
    };

    //if (!results || results.length === 0) return <></>;

    return (
        <>
            {/* TOP ACTION BUTTONS */}
            <div style={{
                marginBottom: "15px",
                /*
                display: "flex",
                alignItems: "center",
                gap: "10px" // sopiva väli elementtien väliin
            */
            }}>
                <ReadOnlyField label="Tunniste:" value={personId} />
                <button onClick={fetchResults}>Hae tulokset</button>{" "}
                {selectedIds.length > 0 && (
                    <>
                        <button onClick={deleteSelected}>Poista valitut</button>{" "}
                        <button onClick={copySelected}>Kopioi valitut uusien pohjaksi</button>{" "}
                        <button onClick={editSelected}>Muuta valitut</button>
                    </>
                )}
            </div >

            {/* MAIN TABLE */}
            < table style={{ width: "100%", borderCollapse: "collapse" }
            } border={1} cellPadding={6} >
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={
                                    selectedIds.length === sortedResults.length &&
                                    sortedResults.length > 0
                                }
                                onChange={toggleAll}
                            />
                        </th>

                        {labResultFields.map((field: LabField) => (
                            <th
                                key={field.key}
                                onClick={() => field.sortable && handleSort(field.key)}
                                style={{
                                    cursor: field.sortable ? "pointer" : "default",
                                    userSelect: "none"
                                }}
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
                                    {field.key === "PersonID"
                                        ? personId
                                        : (row as any)[field.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table >
        </>
    );
};

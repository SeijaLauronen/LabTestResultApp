// SL 202511: component for readonly fields
import React from "react";

interface Props {
    label?: string;
    value: string | number | null | undefined;
    width?: string;
}

export const ReadOnlyField: React.FC<Props> = ({ label, value, width }) => {
    return (
        
        <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>

            {label && (
                <span
                    style={{
                        fontWeight: "bold",
                        marginRight: "6px",
                        fontSize: "0.9rem",
                        lineHeight: "1.5rem"   // <-- sama korkeus labelille
                    }}
                >
                    {label}
                </span>
            )}

            <span
                style={{
                    padding: "6px 10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "#f7f7f7",
                    minWidth: width || "80px",
                    lineHeight: "1.5rem",
                    minHeight: "1.5rem", // <-- kiinteä korkeus
                    display: "flex",
                    alignItems: "center"
                }}
            >
                {value ?? "—"}
            </span>

        </div>

    );
};

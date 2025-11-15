// components/Tabs.tsx
// SL 202511: Tab component for switching between views
import React from "react";

interface TabItem<T extends string>  {
    key: T;
    label: string;
}

interface TabsProps<T extends string> {
    tabs: TabItem<T>[];
    active: T;
    onChange: (key: T) => void;
}

//export const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange }) => {
export function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
    return (
        <div style={{ display: "flex", borderBottom: "1px solid #ccc", marginBottom: 12 }}>
            {tabs.map(tab => (
                <div
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        borderBottom: active === tab.key ? "3px solid #007bff" : "3px solid transparent",
                        fontWeight: active === tab.key ? "bold" : "normal"
                    }}
                >
                    {tab.label}
                </div>
            ))}
        </div>
    );
};

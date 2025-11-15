// SL 202511: Lab result form component for adding new results
// TODO henkilön tunniste luetaan vain päänäytöltä...
import React, { useState, useEffect } from "react";
import { LabResult, addLabResult, updateLabResult } from "../api/labresults";
import { labResultFields, copyFields, newRowDefaults } from "../definitions/fieldDefinitions";

interface Props {
    personId?: string;
    results?: LabResult[];
    //onAdd: () => void; // Callback when a new result is added
    //onSave?: (updatedResult: LabResult) => void;
    onSave?: (savedResults: LabResult[]) => void;  // ← korjattu!
}


const visibleFields = labResultFields.filter(field => field.editable);


export const LabResultForm: React.FC<Props> = ({ onSave, results, personId }) => {
    const [form, setForm] = useState<LabResult>({ PersonID: "" });
    const [formResults, setFormResults] = useState<LabResult[]>(results || []);

    useEffect(() => {
        setFormResults(results || []);
    }, [results]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };




// Create a new empty row, copying copyFields values from the last newRows row (if any) or defaults
    const addNewResult = () => {
        //alert("addNewResult called");
        if (!personId) {
            return alert("Anna henkilön tunniste ennen uuden rivin lisäämistä.");
        }
        const prev = formResults.length ? formResults[formResults.length - 1] : null;

        // Luo tyhjä LabResult-objekti
        //const newResult: LabResult = {} as LabResult;
        const newResult: LabResult = {
            ID: null, // alusta tyhjäksi
            PersonID: personId, // aseta henkilön tunnus
        } as unknown as LabResult; // ei sallinut tuota ID=null, jos ei laittanut unknown tähän...
        type LabResultKey = keyof LabResult; //Määritellään avaintyyppi



        labResultFields.forEach(f => {
            const key = f.key as LabResultKey;  // Muunna avain oikeaan tyyppiin
            // Jos kenttä kuuluu copyFields-listaan, kopioi edellisestä rivistä tai käytä oletusarvoa
            if (copyFields.includes(f.key)) {

                //keyof LabResult ei kata kaikkia mahdollisia labFields-kenttiä, tai TypeScript ei pysty päättelemään, että kaikki kentät ovat kirjoitettavissa newResultiin. 
                //Kun TS ei voi varmuudella tietää, että newResult[key] on sallittu, tyyppi on never. Käytetään any-tyyppiä kiertämään tämä rajoitus.
                //ei ole täysin tyyppiturvallinen, mutta käytännössä turvallinen tässä tilanteessa, kun tiedetään, että labFields ja LabResult vastaavat toisiaan.
                (newResult as any)[key] = prev && prev[key] !== undefined
                    ? prev[key]
                    : (newRowDefaults[key]?.() ?? '');
            } else {
                // other fields get default value (not copied)                
                (newResult as any)[key] = typeof newRowDefaults[f.key] === 'function'
                    ? newRowDefaults[f.key]()
                    : (newRowDefaults[f.key] ?? '');
            }
        });

        setFormResults([...formResults, newResult as LabResult]);

    };




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Käydään läpi jokainen rivi
        const saved: LabResult[] = [];

        try {
            for (const row of formResults) {
                console.log("Tallennetaan rivi:", row);
                // Uusi rivi → POST
                if (!row.ID || row.ID === 0) {
                    row.PersonID = personId || ""; //TODO ei saa jäädä tyhjäksi, ja olikin tämä arvo saatu jostain...
                    const added = await addLabResult(row);
                    saved.push(added);
                }
                // Olemassa oleva → PUT
                else {
                    const updated = await updateLabResult(row.ID, row);
                    console.log("Päivitetty rivi:", updated);
                    saved.push(updated);
                }
            }

            console.log("Tallennus valmis:", saved);

            onSave?.(saved);   // kerrotaan parentille että tallennus ok

            //alert("Tallennettu!");
        } catch (err: any) {
            console.error("👉 Tallennusvirhe", err);

            if (err.response) {
                alert(
                    "Virhe tallennuksessa (server): "
                    + err.response.status
                    + " - "
                    + JSON.stringify(err.response.data)
                );
            } else {
                alert("Virhe tallennuksessa (client): " + err.message);
            }
        }
    };

    //const data = results || [];
    const data = formResults; // tämä, että taulukko päivittyy heti näytöllä!

    function onDelete(i: number): void {
        //throw new Error("Function not implemented.");
        //alert("LabResultForm onDelete " + i);
        const copy = [...formResults];
        copy.splice(i, 1);
        setFormResults(copy);
    }

    function onFieldChange(idx: number, key: string, value: string): void {
        //alert("LabResultForm onFieldChange");
        //throw new Error("Function not implemented.");
        const copy = [...formResults];
        copy[idx] = { ...copy[idx], [key]: value };
        setFormResults(copy);
    }


    return (
        <form onSubmit={handleSubmit}>

            <label>Henkilön tunniste:</label>
            <input
                name="PersonId"
                placeholder="Henkilön tunniste"
                value={personId}
                onChange={handleChange}
                required
            />

            <table style={{ borderCollapse: "collapse" }} border={1} cellPadding={6}>
                <tbody>
                    <tr>
                        <th> <button
                            type="button"
                            onClick={() => { addNewResult(); }}
                            style={{ marginLeft: '8px' }}>Lisää uusi tulos</button>

                        </th>
                        {data.map((_, i) => ( // array.map((item, index) => { ... }), koska itemiä ei käytetä, merkataan se vain _, voisi olla myös item
                            <th key={i} style={{ textAlign: 'center' }}>
                                <button 
                                 type="button"
                                onClick={() => onDelete(i)} 
                                style={{ fontSize: '0.8rem' }}>
                                    Poista
                                </button>
                            </th>
                        ))}
                        <th>{/* actions column, unused here */}</th>
                    </tr>
                    {labResultFields.map((field) => (<tr key={field.key}>
                        <th style={{ textAlign: 'left', verticalAlign: 'top', paddingRight: '8px' }}>{field.label}</th>
                        {data.map((item, idx) => (
                            <td key={idx}>
                                {field.editable ? (
                                    <input
                                        type={field.type || 'text'}
                                        value={item[field.key as keyof LabResult] ?? ''}
                                        onChange={(e) => onFieldChange(idx, field.key, e.target.value)}
                                    />
                                ) : (
                                    item[field.key as keyof LabResult] ?? ''
                                )}
                            </td>
                        ))}
                        <td></td>
                    </tr>
                    ))}

                </tbody>
            </table>

            <button type="submit">Tallenna</button>
        </form>
    );
};








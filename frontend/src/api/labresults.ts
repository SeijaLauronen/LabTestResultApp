// SL 202511: Lab results API calls
import axios from "axios";

const API_URL = "http://localhost:5000/api/labresults";

export interface LabResult {
    ID?: number;
    PersonID: string;
    SampleDate?: string;
    CombinedName?: string;
    AnalysisName?: string;
    AnalysisShortName?: string;
    AnalysisCode?: string;
    Result?: string;
    MinimumValue?: string;
    MaximumValue?: string;
    ValueReference?: string;
    Unit?: string;
    Cost?: number;
    CompanyUnitName?: string;
    AdditionalInfo?: string;
    AdditionalText?: string;
    ResultAddedDate?: string;
    ToMapDate?: string;
}

// 🔹 Hae henkilön tulokset
export const getLabResults = async (personId: string) => {
    const res = await axios.get<LabResult[]>(`${API_URL}/${personId}`);
    return res.data;
};

// 🔹 Lisää tulos kantaan
export const addLabResult = async (result: LabResult): Promise<LabResult> => {
    try {
        console.log("POST payload:", result);
        const res = await axios.post<LabResult>(API_URL, result);
        return res.data;
    } catch (err: any) {
        console.error("POST ERROR:", err.response?.data || err.message);
        throw err; // tärkeää!!
    }
};

// 🔹 Päivitä tulos
export const updateLabResult = async (
    id: number,
    data: Partial<LabResult>
): Promise<LabResult> => {
    try {
        console.log("PUT payload:", id, data);
        const res = await axios.put<LabResult>(`${API_URL}/${id}`, data);
        return res.data;
    } catch (err: any) {
        console.error("PUT ERROR:", err.response?.data || err.message);
        throw err;
    }
};

// 🔹 Poista tulos
export const deleteLabResult = async (id: number) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};
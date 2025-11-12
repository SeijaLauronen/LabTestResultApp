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

// 🔹 Lisää tulos
export const addLabResult = async (result: LabResult): Promise<LabResult> => {
  const res = await axios.post<LabResult>(API_URL, result);
  return res.data;
};


// 🔹 Päivitä tulos
export const updateLabResult = async (id: number, data: Partial<LabResult>) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

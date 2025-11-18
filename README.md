# 📘 LabTestResultApp – Full-Stack Laboratory Results Management

**LabTestResultApp** on full-stack-sovellus, joka yhdistää:

- **Node.js + Express + TypeScript** backendin  
- **React + TypeScript** frontendin  
- **MySQL** tietokannan  

Sovellus mahdollistaa laboratoriotulosten **haun**, **lisäämisen**, **muokkaamisen**, **kopioimisen**, **poistamisen**, sekä **massatuonnin** (ominaisuus tulossa).  
Käyttöliittymä on jaettu välilehtiin (Tabs): Hakutulokset, Lisäys/Muokkaus, Massatuonti

---

## 🚀 Ominaisuudet

### 🔍 1. Päänäyttö
- Henkilön tunniste annetaan jokaiselle välilehdelle yhteisellä päänäytöllä

### 📋 2. Hakutulosten taulukko
- Näyttää haetut tulokset
- Rivien monivalinta checkboxeilla
- Sarakelajittelu
- Massatoiminnot:
  - Poista valitut
  - Kopioi valitut uusien pohjaksi
  - Muuta valittuja rivejä
- TODO: lisää hakuehtoja (päivämäärä, analyysin nimi jne.)

### ✏️ 3. Tulosten lisääminen ja muokkaaminen
- Oma **Lisää / Muokkaa** -välilehti
- Pystysuuntainen editorilomake
- Toiminnot:
  - Uusien tulosten lisäys
  - Olemassa olevien tuloksien muokkaus
  - Rivien poisto editorista
- Tallennus:
  - Uudet rivit lisätään tietokantaan
  - Olemassa olevat rivit päivitetään tietokantaan

### 📥 4. Massatuonti (TODO)
- Tekstipohjaisten rivien kerralla liittäminen ja automaattinen jäsentäminen

---
🔄 Datan kulku (React → Node.js/Express → MySQL)

Frontend (React + TypeScript) käyttää Axiosia lähettääkseen HTTP-pyyntöjä Node.js/Express REST API:in.
Node.js käsittelee pyynnön ja hakee/päivittää tietoja MySQL-tietokannassa MySQL2-kirjaston avulla.

┌──────────────────────────┐        Axios (GET/POST/PUT/DELETE)       ┌─────────────────────────────┐
│  React + TypeScript      │  ─────────────────────────────────────▶ │  Node.js + Express          │
│  Frontend                │                                          │  Backend (API)              │
│  - LabTestResults.tsx    │                                          │  - routes/labresults.ts     │
│  - api/labresults.ts     │  ◀───────────────────────────────────── │  - TypeScript               │
│  - axios.get(...)        │        JSON response                     └─────────────┬───────────────┘
└──────────────────────────┘                                                      │
                                                                                  │
                                                                                  ▼
                                                                     ┌──────────────────────────┐
                                                                     │   MySQL Database         │
                                                                     │   - labtestresults       │
                                                                     └──────────────────────────┘

---

## 📂 Projektirakenne

```
LabTestResultApp/
│
├── backend/
│   ├── src/
│   │   ├── db.ts
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   └── labresults.ts
│   ├── tsconfig.json
│   ├── .env
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── labresults.ts
    │   ├── components/
    │   │   ├── ImportResults.tsx
    │   │   ├── LabResultForm.tsx
    │   │   ├── LabResultsTable.tsx
    │   │   ├── LabTestResultTableHorizontal.tsx
    │   │   ├── LabTestResultTableVertical.tsx
    │   │   └── Tabs.tsx
    │   ├── definitions/
    │   ├── App.tsx
    │   ├── LabTestResults.tsx
```
Projektin tärkeimmät kooditiedostot on myös merkitty tunnisteella: // SL 202511:

---


## 🛠️ Asennusohjeet

### 1. Kloonaa projekti

```sh
git clone https://github.com/USERNAME/LabTestResultApp.git
cd LabTestResultApp
```

---

# 🔌 Backend (Node + Express + TS)

### 2. Siirry backend-kansioon

```sh
cd backend
```

### 3. Asenna riippuvuudet

```sh
npm install
```

### 4. Luo `.env` tiedosto

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=healthdb
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Käynnistä backend

#### Kehitystilassa (ts-node):

```sh
npm run dev
```

#### Tuotantotilassa:

```sh
npm run build
npm start
```

Backend avautuu osoitteeseen:

```
http://localhost:5000/api/labresults
```

---

# 💻 Frontend (React + TypeScript)

### 1. Siirry frontend-kansioon

```sh
cd ../frontend
```

### 2. Asenna riippuvuudet

```sh
npm install
```

### 3. Käynnistä kehityspalvelin

```sh
npm run dev
```

Frontend avautuu osoitteeseen:

```
http://localhost:3000/
```

---

# 🔌 REST API - päätepisteet

### GET – Hae tulokset

```
GET /api/labresults/:personId
```

### POST – Lisää uusi tulos

```
POST /api/labresults
{
  "PersonID": "test123",
  "SampleDate": "2025-11-14T09:00",
  "AnalysisName": "Hemoglobiini",
  "Result": "145"
}
```

### PUT – Päivitä tulos

```
PUT /api/labresults/42
```

### DELETE – Poista tulos

```
DELETE /api/labresults/42
```

---

# 🧪 Tietokanta

```sql
CREATE TABLE labtestresults (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  PersonID VARCHAR(100) NOT NULL,
  SampleDate DATETIME NOT NULL,
  AnalysisName VARCHAR(255),
  CombinedName VARCHAR(255),
  AnalysisShortName VARCHAR(100),
  AnalysisCode VARCHAR(100),
  Result VARCHAR(100),
  Unit VARCHAR(50),
  MinimumValue VARCHAR(50),
  MaximumValue VARCHAR(50),
  ValueReference VARCHAR(255),
  CompanyUnitName VARCHAR(255),
  AdditionalInfo TEXT,
  AdditionalText TEXT,
  ResultAddedDate DATETIME NOT NULL,
  ToMapDate DATETIME
);
```

---


# 📌 TODO

- Lisää hakuehtoja (päivämäärä, analyysin nimi, yksikkö…)
- Massatuonnin toteutus
- Virhetilanteiden kiinni otto
- Paremmat virheilmoitukset
- UI-viimeistely
- Testit (Jest / Vitest)

---

## 👩‍💻 Tekijä

**Seija Lauronen**  
🗂️ [github.com/SeijaLauronen](https://github.com/SeijaLauronen)

---

## 📜 Lisenssi

Tämä projekti on tarkoitettu henkilökohtaiseen ja oppimiskäyttöön.

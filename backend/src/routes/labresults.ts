// SL 202511: Tietokantaoperaatiot
import { Router } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../db";

const router = Router();

// 🔹 Hae tulokset henkilön perusteella
router.get("/:personId", async (req, res) => {
  const { personId } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM labtestresults WHERE PersonID = ?", [personId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// 🔹 Lisää uusi tulos
router.post("/", async (req, res) => {
  const resultData = req.body;

  // 🔹 Lisää automaattinen aikaleima jos puuttuu
  if (!resultData.ResultAddedDate || resultData.ResultAddedDate.trim() === "") {
    resultData.ResultAddedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  try {
    // 1) INSERT → ResultSetHeader
    const [insertResult] = await pool.query<ResultSetHeader>(
      "INSERT INTO labtestresults SET ?",
      [resultData]
    );

    const newId = insertResult.insertId;

    // 2) Hae juuri lisätty rivi
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM labtestresults WHERE ID = ?",
      [newId]
    );

    if (!rows || rows.length === 0) {
      return res.status(500).json({ error: "Insert OK but fetch failed" });
    }

    // 3) Palauta lisätty rivi
    res.json(rows[0]);

  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ error: "Insert failed" });
  }
});

/*
router.post("/", async (req, res) => {
  const resultData = req.body;

  // 🔹 Varmistetaan, ettei ResultAddedDate ole null
  if (!resultData.ResultAddedDate || resultData.ResultAddedDate.trim() === "") {
    resultData.ResultAddedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  try {
    const [result] = await pool.query("INSERT INTO labtestresults SET ?", [resultData]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});
*/

// 🔹 Päivitä tulos
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await pool.query("UPDATE labtestresults SET ? WHERE ID = ?", [data, id]);

    // 🔹 Hakee päivitetyn rivin ja palauttaa sen
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM labtestresults WHERE ID = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Not found after update" });
    }

    res.json(rows[0]);   // ← palautetaan oikea LabResult
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});


/*
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await pool.query("UPDATE labtestresults SET ? WHERE ID = ?", [data, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});
*/


export default router;

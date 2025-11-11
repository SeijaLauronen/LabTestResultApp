import { Router } from "express";
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
  try {
    const [result] = await pool.query("INSERT INTO labtestresults SET ?", [resultData]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

// 🔹 Päivitä tulos
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

export default router;

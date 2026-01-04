import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Luo yhteysaltaan (tämä on se mitä muut tiedostot käyttävät)
// HUOM! Tässä pitää olla .env:iä vastaavat tiedot
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME, //Huom USERNAME ei USER
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, // Huom DB_DATABASE ei DB_NAME
  dateStrings: true, // päivämäärät merkkijonoina, ettei muuta muutu paikallisajaksi!!!! TÄRKEÄÄ!!!
  port: Number(process.env.DB_PORT) || 3306
});

// 🔹 Testataan yhteys vain käynnistyksen yhteydessä
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL-yhteys toimii!");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL-yhteys epäonnistui:", err);
  }
})();

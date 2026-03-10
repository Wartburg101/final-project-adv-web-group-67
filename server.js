const express = require("express");
const app = express();
const { Pool } = require("pg");
const port = 3000;

// Use a connection pool rather than a single client instance. The pool
// manages multiple connections and lets us reuse them across requests.
const pool = new Pool({
  password: "12345",
  user: "postgres",
  host: "localhost",
  //host: "host.docker.internal",
  port: 5432,
  database: "postgres",
});

//Public folder is used for static files (html, css, js)
app.use(express.static("public"));
app.use(express.json());

let highestId = 0;

// Simple login (hard-coded credentials)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // demo credentials
  const ADMIN_USER = { username: "admin", password: "admin" };
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    return res.json({ success: true, user: { username } });
  }
  return res.status(401).json({ success: false, error: "Invalid credentials" });
});

app.post("/venues", async (req, res) => {
  const { name, district, url } = req.body;
  highestId++;
  const id = highestId;
  try {
    const { rows } = await pool.query("INSERT INTO stores (id, name, district, url) VALUES ($1, $2, $3, $4)", [id, name, district, url]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error adding venue:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/stores", async (req, res) => {
  try {
    // Acquire a client from the pool and run the query
    const { rows } = await pool.query("SELECT * FROM stores");
    res.json(rows);
    //Get the highest ID from the fetched stores
    //Looks through the ID of all stores and saves the highest one
    highestId = rows.reduce((max, store) => Math.max(max, store.id), 0);
    console.log("Stores fetched successfully");
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete-venue", async (req, res) => {
  const { id } = req.body || {};
  try {
    await pool.query("DELETE FROM stores WHERE id = $1", [id]);
    // always send a JSON response; if nothing was deleted send an empty object
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting venue:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/edit-venue", async (req, res) => {
  const { id, name, district, url } = req.body;
  try {
    await pool.query("UPDATE stores SET name = $1, district = $2, url = $3 WHERE id = $4", [name, district, url, id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error editing venue:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

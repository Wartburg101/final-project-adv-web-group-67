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
  port: 5432,
  database: "postgres",
});

app.use(express.static("public"));
app.use(express.json());

// Simple demo login (hard-coded credentials)
app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  // demo credentials
  const ADMIN_USER = { username: 'admin', password: 'admin' };
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    return res.json({ success: true, user: { username } });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

app.get("/stores", async (req, res) => {
  try {
    // Acquire a client from the pool and run the query
    const { rows } = await pool.query("SELECT * FROM stores");
    res.json(rows);
    console.log("Stores fetched successfully");
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require("express");
const app = express();
const { Client } = require("pg");
const port = 3000;

const client = new Client({
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
  const DEMO_USER = { username: 'admin', password: 'admin' };
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    return res.json({ success: true, user: { username } });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

app.get("/stores", async (req, res) => {
  try {
    await client.connect();
    const result = await client.query("SELECT * FROM stores");
    res.json(result.rows);
    console.log("Stores fetched successfully");
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.end();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

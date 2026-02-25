const app = require("express")();
const { Client } = require("pg");
const port = 3000;

const client = new Client({
  password: "12345",
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

app.use("/", require("express").static("public"));

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

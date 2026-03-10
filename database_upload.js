const { Client } = require("pg");
const fs = require("fs");
const client = new Client({
  password: "12345",
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to database");

    await seedStores();
  } catch (err) {
    console.error("Error connecting to database", err);
  }
}

async function seedStores() {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT,
        district TEXT,
        category TEXT
      );
    `);
    // Add category column if it doesn't exist
    await client.query(`
      ALTER TABLE stores ADD COLUMN IF NOT EXISTS category TEXT;
    `);
    console.log("Table ready");

    const stores = JSON.parse(fs.readFileSync("./stores.json", "utf-8"));
    // Clear existing data
    await client.query("DELETE FROM stores");
    for (const store of stores) {
      await client.query("INSERT INTO stores (name, url, district, category) VALUES ($1, $2, $3, $4)", [store.name, store.url, store.district, store.category]);
    }

    console.log("Stores inserted successfully");
  } catch (err) {
    console.error("Error seeding stores:", err);
  }
}

async function selectRecords() {
  try {
    const res = await client.query("SELECT * FROM stores");
    console.log(res.rows);
  } catch (err) {
    console.error("Error executing query", err);
  }
}

function disconnectDB() {
  client
    .end()
    .then(() => console.log("Disconnected from database"))
    .catch((err) => console.error("Error disconnecting from database", err));
}

connectDB();

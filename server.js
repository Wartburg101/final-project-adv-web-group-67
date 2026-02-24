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

    //await seedStores();
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
        district TEXT
      );
    `);
    console.log("Table ready ✅");

    const stores = JSON.parse(fs.readFileSync("./stores.json", "utf-8"));
    for (const store of stores) {
      await client.query("INSERT INTO stores (name, url, district) VALUES ($1, $2, $3)", [store.name, store.url, store.district]);
    }

    console.log("Stores inserted successfully 🚀");
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
selectRecords();

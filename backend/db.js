import pkg from "pg";
const { Pool } = pkg;

let dbURL = process.env.DATABASE_URL;

// Defensive trim and type-check
if (typeof dbURL !== "string") {
  console.error("❌ DATABASE_URL is not a string:", dbURL);
} else {
  dbURL = dbURL.trim();
  console.log("🔗 Using database:", dbURL);
}

const pool = new Pool({
  connectionString: dbURL,
});

export default pool;

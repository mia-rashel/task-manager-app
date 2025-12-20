// db.js
import pkg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbURL = process.env.DATABASE_URL;

// Defensive trim
if (typeof dbURL !== "string") {
  console.error("❌ DATABASE_URL is not a string:", dbURL);
} else {
  dbURL = dbURL.trim();
  console.log("🔗 Using database:", dbURL);
}

let sslConfig = false;

// ✅ Use SSL CA cert if it exists
const certPath = path.join(__dirname, "certs", "rds-ca.pem");
if (fs.existsSync(certPath)) {
  sslConfig = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(certPath).toString(),
  };
  console.log("✅ Loaded RDS SSL certificate.");
} else {
  console.warn("⚠️ RDS CA certificate not found at", certPath);
}

const pool = new Pool({
  connectionString: dbURL,
  ssl: sslConfig,
});

export default pool;

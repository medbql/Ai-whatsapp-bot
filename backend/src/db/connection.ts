import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();


const psql = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432')
})

psql.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

psql.on('error', (err: Error) => {
  console.error('❌ Database error:', err);
  process.exit(-1);
});

export default psql;

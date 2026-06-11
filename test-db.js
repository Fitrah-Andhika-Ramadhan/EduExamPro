const postgres = require('postgres');

async function test() {
  const sql = postgres('postgresql://postgres:Maingamesdika%40123@[2406:da1c:61c:d600:ed95:30a4:d26a:ba00]:5432/postgres');
  try {
    const result = await sql`SELECT 1 as x`;
    console.log("Connection successful:", result);
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    process.exit(0);
  }
}

test();

import { sql } from '@vercel/postgres';

export async function createVotesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      option TEXT UNIQUE NOT NULL,
      count INTEGER DEFAULT 0
    );
  `;

  // 初期データの投入
  const options = ['VLOOKUP関数', 'XLOOKUP関数', 'INDEX/MATCH関数'];
  for (const option of options) {
    await sql`
      INSERT INTO votes (option, count)
      VALUES (${option}, 0)
      ON CONFLICT (option) DO NOTHING;
    `;
  }
}

export async function getVotes() {
  const { rows } = await sql`SELECT * FROM votes ORDER BY id ASC;`;
  return rows;
}

export async function incrementVote(option: string) {
  await sql`
    UPDATE votes
    SET count = count + 1
    WHERE option = ${option};
  `;
}

import { PoolClient } from 'pg';

/**
 * Generate an incremental document number like ORD-2026-001 / INV-2026-001.
 * Counts existing rows for the current year on the given table+column.
 * Runs inside the caller's transaction to avoid race conditions.
 */
export async function nextDocNumber(
  client: PoolClient,
  table: 'orders' | 'invoices',
  column: 'nomor_order' | 'nomor_invoice',
  prefix: 'ORD' | 'INV'
): Promise<string> {
  const year = new Date().getFullYear();
  const like = `${prefix}-${year}-%`;
  const res = await client.query(
    `SELECT ${column} AS num FROM ${table} WHERE ${column} LIKE $1 ORDER BY ${column} DESC LIMIT 1`,
    [like]
  );
  let seq = 1;
  if (res.rows[0]?.num) {
    const last = Number(String(res.rows[0].num).split('-').pop());
    if (!Number.isNaN(last)) seq = last + 1;
  }
  return `${prefix}-${year}-${String(seq).padStart(3, '0')}`;
}

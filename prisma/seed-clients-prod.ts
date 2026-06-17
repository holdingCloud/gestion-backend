import { PrismaClient, ContactStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({ log: ['error'] });

interface ClientRecord {
  fullname: string;
  address: string;
  phone: string;
  email: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  contactStatus: ContactStatus;
  n_depto_casa: string | null;
  referencia: string | null;
  communeId: number | null;
  frequency: number | null;
  companyId: number | null;
}

// Parses a single SQL VALUES row: ('val', 'val', true, 123, ...)
function parseSqlRow(line: string): string[] {
  const s = line.trim().replace(/^\(/, '').replace(/\)[,;]?\s*$/, '');
  const values: string[] = [];
  let i = 0;

  while (i < s.length) {
    while (i < s.length && s[i] === ' ') i++;
    if (i >= s.length) break;

    if (s[i] === "'") {
      i++;
      let val = '';
      while (i < s.length) {
        if (s[i] === "'" && s[i + 1] === "'") {
          val += "'";
          i += 2;
        } else if (s[i] === "'") {
          i++;
          break;
        } else {
          val += s[i++];
        }
      }
      values.push(val);
    } else {
      let val = '';
      while (i < s.length && s[i] !== ',') val += s[i++];
      values.push(val.trim());
    }

    while (i < s.length && s[i] === ' ') i++;
    if (i < s.length && s[i] === ',') i++;
  }

  return values;
}

function parseSqlFile(filePath: string): ClientRecord[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const records: ClientRecord[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line.startsWith('(')) continue;

    const fields = parseSqlRow(line);
    if (fields.length < 13) continue;

    const communeRaw = parseInt(fields[10], 10);
    const freqRaw = parseInt(fields[11], 10);
    const companyRaw = parseInt(fields[12], 10);

    records.push({
      fullname:     fields[0],
      address:      fields[1],
      phone:        fields[2],
      email:        fields[3],
      available:    fields[4] === 'true',
      createdAt:    new Date(fields[5]),
      updatedAt:    new Date(fields[6]),
      contactStatus: fields[7] as ContactStatus,
      n_depto_casa: fields[8] || null,
      referencia:   fields[9] || null,
      communeId:    isNaN(communeRaw) || communeRaw === 0 ? null : communeRaw,
      frequency:    isNaN(freqRaw)    || freqRaw    === 0 ? null : freqRaw,
      companyId:    isNaN(companyRaw) || companyRaw === 0 ? null : companyRaw,
    });
  }

  return records;
}

async function seedClientsProd(): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[seed-clients] NODE_ENV != production, skipping.');
    return;
  }

  const sqlPath = path.join(process.cwd(), 'prisma', 'import_clients.SQL');

  if (!fs.existsSync(sqlPath)) {
    console.warn('[seed-clients] import_clients.SQL not found, skipping.');
    return;
  }

  console.log('[seed-clients] Parsing import_clients.SQL...');
  const records = parseSqlFile(sqlPath);
  console.log(`[seed-clients] ${records.length} records found in file.`);

  // Load valid FK ids to avoid constraint violations
  const [validCommunes, validCompanies] = await Promise.all([
    prisma.commune.findMany({ select: { id: true } }),
    prisma.company.findMany({ select: { id: true } }),
  ]);
  const communeIds  = new Set(validCommunes.map((c) => c.id));
  const companyIds  = new Set(validCompanies.map((c) => c.id));

  // Build a set of phones and addresses already in the DB
  const existing = await prisma.clients.findMany({
    select: { phone: true, address: true },
  });
  const existingPhones    = new Set(existing.map((c) => c.phone.trim()).filter(Boolean));
  const existingAddresses = new Set(existing.map((c) => c.address.trim()).filter(Boolean));

  // A record is "new" if its phone (or address when phone is blank) isn't in the DB
  const newRecords = records
    .filter((r) => {
      const phone = r.phone.trim();
      if (phone && phone !== ' ') return !existingPhones.has(phone);
      const addr = r.address.trim();
      if (addr && addr !== ' ') return !existingAddresses.has(addr);
      return false;
    })
    .map((r) => ({
      ...r,
      // Nullify FK references that don't exist in the DB yet
      communeId: r.communeId !== null && communeIds.has(r.communeId) ? r.communeId : null,
      companyId: r.companyId !== null && companyIds.has(r.companyId) ? r.companyId : null,
      // Truncate fields to match column limits
      phone:   r.phone.trim().slice(0, 15),
      address: r.address.trim().slice(0, 100),
      n_depto_casa: r.n_depto_casa ? String(r.n_depto_casa).slice(0, 50) : null,
    }));

  if (newRecords.length === 0) {
    console.log('[seed-clients] No new records to import. Done.');
    return;
  }

  console.log(`[seed-clients] Importing ${newRecords.length} new clients...`);

  const BATCH = 500;
  let done = 0;

  for (let i = 0; i < newRecords.length; i += BATCH) {
    const batch = newRecords.slice(i, i + BATCH);
    await prisma.clients.createMany({ data: batch, skipDuplicates: true });
    done += batch.length;
    console.log(`[seed-clients]   ${done}/${newRecords.length}`);
  }

  console.log(`[seed-clients] Done: ${newRecords.length} clients imported.`);
}

seedClientsProd()
  .catch((e) => {
    console.error('[seed-clients] Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

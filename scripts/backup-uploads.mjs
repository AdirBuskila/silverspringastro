// Copies everything added through the admin page (database rows and uploaded files) into
// a local folder. Run weekly by .github/workflows/backup-uploads.yml. Only public data is
// read, using the same public key the website uses.
//
//   SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/backup-uploads.mjs <output-folder>

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
const outputDir = process.argv[2];
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !outputDir) {
  throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY, and pass an output folder.');
}

const STORAGE_MARKER = '/storage/v1/object/public/images/';
const PAGE_SIZE = 1000;

async function fetchTable(table) {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=${PAGE_SIZE}&offset=${offset}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    if (!response.ok) throw new Error(`${table}: HTTP ${response.status}`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < PAGE_SIZE) return rows;
  }
}

await mkdir(outputDir, { recursive: true });
const filesRoot = path.resolve(outputDir, 'files');

const urls = new Set();
for (const table of ['images', 'travel_photos', 'photo_settings']) {
  const rows = await fetchTable(table);
  await writeFile(path.join(outputDir, `${table}.json`), JSON.stringify(rows, null, 2));
  for (const row of rows) {
    if (row.image_path) urls.add(row.image_path);
    if (row.thumbnail_path) urls.add(row.thumbnail_path);
  }
  console.log(`${table}: ${rows.length} rows`);
}

for (const url of urls) {
  const index = url.indexOf(STORAGE_MARKER);
  if (index === -1) throw new Error(`Not a storage URL: ${url}`);
  const target = path.resolve(filesRoot, decodeURIComponent(url.slice(index + STORAGE_MARKER.length)));
  if (!target.startsWith(filesRoot + path.sep)) throw new Error(`Unsafe path: ${url}`);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
}
console.log(`files: ${urls.size}`);

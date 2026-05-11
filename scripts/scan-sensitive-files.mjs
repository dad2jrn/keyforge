import { readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const bannedExtensions = new Set([
  '.sqlite', '.sqlite3', '.db', '.db3', '.mkdb', '.csv', '.tsv', '.xlsx', '.xls', '.ods',
  '.numbers', '.bak', '.backup', '.dump', '.sql', '.zip', '.7z', '.rar', '.tar', '.gz'
]);

const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const allowedFiles = new Set(['package-lock.json']);
const roots = ['.', 'dist'];
const violations = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry) && entry !== 'dist') continue;

    const absolute = join(directory, entry);
    const relativePath = relative(process.cwd(), absolute);
    const stats = statSync(absolute);

    if (stats.isDirectory()) {
      walk(absolute);
      continue;
    }

    if (allowedFiles.has(entry)) continue;

    const extension = extname(entry).toLowerCase();
    if (bannedExtensions.has(extension)) {
      violations.push(relativePath);
    }
  }
}

for (const root of roots) {
  try {
    walk(root);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

if (violations.length > 0) {
  console.error('Sensitive or dangerous file extensions are not allowed in this repository/build:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('Sensitive file extension scan passed.');

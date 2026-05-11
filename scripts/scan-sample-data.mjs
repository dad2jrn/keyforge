import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const checkedExtensions = new Set(['.html', '.md', '.ts', '.tsx', '.js', '.jsx', '.json']);
const allowedFiles = new Set(['PLAN.md', 'STYLE.md', 'package-lock.json', 'scan-sample-data.mjs']);

const bannedPatterns = [
  {
    name: 'realistic six-cut bitting sequence',
    pattern: /\b(?:bitting|cuts?|pinning|key\s+cuts?)\b.{0,40}\b[0-9](?:[-\s]?[0-9]){5}\b/i,
  },
  {
    name: 'street address',
    pattern: /\b\d{1,6}\s+[A-Z][a-z]+\s+(Street|St\.?|Avenue|Ave\.?|Road|Rd\.?|Boulevard|Blvd\.?|Lane|Ln\.?|Drive|Dr\.?)\b/,
  },
  {
    name: 'customer-like fixture name',
    pattern: /\b(Acme|Globex|Initech|Umbrella|Wayne Enterprises|Stark Industries)\b/i,
  },
];

const violations = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) continue;

    const absolute = join(directory, entry);
    const relativePath = relative(process.cwd(), absolute);
    const stats = statSync(absolute);

    if (stats.isDirectory()) {
      walk(absolute);
      continue;
    }

    if (allowedFiles.has(entry) || !checkedExtensions.has(extname(entry).toLowerCase())) continue;

    const content = readFileSync(absolute, 'utf8');
    for (const bannedPattern of bannedPatterns) {
      if (bannedPattern.pattern.test(content)) {
        violations.push(`${relativePath}: ${bannedPattern.name}`);
      }
    }
  }
}

walk('.');

if (violations.length > 0) {
  console.error('Potentially realistic sensitive sample data detected:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('Sample data realism scan passed.');

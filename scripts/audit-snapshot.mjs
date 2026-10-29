import { readFile, readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const phase = process.argv[2] || 'after';
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
let gitAvailable = true;
const git = args => { try { return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 40_000_000, stdio:['ignore','pipe','pipe'] }).trim(); } catch { gitAvailable=false; return ''; } };
const excluded = new Set(['node_modules', '.git', '.openai', 'dist', 'audit', 'exports', '.sites-runtime']);
async function files(dir = root) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await files(absolute)); else if (entry.isFile()) found.push(absolute);
  }
  return found;
}
const patterns = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{30,})\b/g],
  ['aws-access-id', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['openai-style-secret', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}\b/g],
  ['jwt', /\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\b/g],
  ['credential-url', /https?:\/\/[^\s/@:]+:[^\s/@]{5,}@[^\s/]+/g],
];
function scan(text, location) {
  const hits = [];
  for (const [type, expression] of patterns) for (const match of text.matchAll(expression)) {
    hits.push({ type, location, line: text.slice(0, match.index).split('\n').length, fingerprint: sha(match[0]).slice(0, 12) });
  }
  return hits;
}
const sourceFiles = [];
const secretFindings = [];
for (const absolute of await files()) {
  const relative = path.relative(root, absolute).replaceAll('\\', '/');
  const bytes = await readFile(absolute);
  sourceFiles.push({ file: relative, bytes: bytes.length, sha256: sha(bytes) });
  if (/\.(?:m?[jt]sx?|json|html|css|md|ya?ml|txt|example)$/.test(relative) && bytes.length < 2_000_000) secretFindings.push(...scan(bytes.toString('utf8'), relative));
}
const seen = new Set(); let historyTextBlobs = 0;
for (const entry of git(['rev-list', '--objects', '--all']).split('\n')) {
  const [object, ...parts] = entry.split(' '), name = parts.join(' ');
  if (!name || !/\.(?:m?[jt]sx?|json|html|css|md|ya?ml|txt|example)$/.test(name) || seen.has(object)) continue;
  seen.add(object);
  const size = Number(git(['cat-file', '-s', object])); if (size > 2_000_000) continue;
  const content = git(['cat-file', '-p', object]); historyTextBlobs++;
  secretFindings.push(...scan(content, `git:${object}:${name}`));
}
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const licenses = [];
for (const [directory, entry] of Object.entries(lock.packages || {})) {
  if (!directory || !directory.includes('node_modules')) continue;
  try {
    const pkg = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
    const names = (await readdir(directory)).filter(n => /^(licen[sc]e|notice|copying)(\.|$)/i.test(n));
    const evidence = [];
    for (const name of names) { const file = path.join(directory, name); if ((await stat(file)).isFile()) { const bytes = await readFile(file); evidence.push({ file: file.replaceAll('\\','/'), sha256: sha(bytes) }); } }
    let verifiedLicense=pkg.license;
    if (!verifiedLicense && pkg.name==='webgl-constants') {
      const licenseText=await readFile(path.join(directory,'LICENSE'),'utf8');
      if (licenseText.startsWith('MIT License') && licenseText.includes('Permission is hereby granted')) verifiedLicense='MIT (verified LICENSE)';
    }
    licenses.push({ name: pkg.name, version: pkg.version, license: verifiedLicense || 'NOT DECLARED', dev: Boolean(entry.dev), directory, licenseEvidence: evidence, status: evidence.length ? 'DECLARED_WITH_LOCAL_EVIDENCE' : 'DECLARED_METADATA_ONLY' });
  } catch { licenses.push({ directory, version: entry.version, license: entry.license || 'NOT DECLARED', dev: Boolean(entry.dev), status: 'NOT_INSTALLED_OR_UNVERIFIED' }); }
}
const result = { date: new Date().toISOString(), phase, baselineCommit: git(['rev-parse','HEAD']), node: process.version, platform: process.platform, sourceFiles, licenses, secretScan: { patterns: patterns.map(p => p[0]), historyTextBlobs, findings: secretFindings, limitation: 'Pattern-based scan of current text sources and unique text blobs in reachable Git history. Not proof that every possible secret is absent.' } };
await mkdir('audit/evidence', { recursive: true });
await writeFile(`audit/evidence/snapshot-${phase}.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ phase, commit: result.baselineCommit, files: sourceFiles.length, installedDependencies: licenses.length, unknownLicenses: licenses.filter(l => l.license === 'NOT DECLARED'), secretFindings: secretFindings.length, historyTextBlobs }));
if (!gitAvailable) console.log('Git history unavailable; working-tree scan only.');
if (process.argv.includes('--strict') && secretFindings.length) process.exitCode=1;

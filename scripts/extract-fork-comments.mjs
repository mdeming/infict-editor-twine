/**
 * Extracts comment lines added or changed vs upstream/develop for fork review.
 * Run from repo root: node scripts/extract-fork-comments.mjs
 * Override base: FORK_COMMENT_BASE=upstream/main node scripts/extract-fork-comments.mjs
 */
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const UPSTREAM_REF = process.env.FORK_COMMENT_BASE ?? 'upstream/develop';

const CODE_FILE =
	/\.(tsx?|jsx?|mjs|cjs|css)$/i;

let diff;
try {
	diff = execSync(`git diff ${UPSTREAM_REF}...HEAD`, {
		cwd: root,
		encoding: 'utf8',
		maxBuffer: 100 * 1024 * 1024
	});
} catch (e) {
	console.error('git diff failed:', e.message);
	process.exit(1);
}

/** JSDoc / block middle lines: * foo — not markdown **bold** or *= */
function isBlockCommentLine(s) {
	const t = s.trim();
	if (!t) return false;
	if (t.startsWith('/*') || t.startsWith('/**')) return true;
	if (t === '*/') return true;
	if (t.startsWith('**')) return false;
	if (/^\*[=*/]/.test(t)) return false;
	if (/^\*\s+\S/.test(t)) return true;
	if (/^\*\/\s*$/.test(t)) return true;
	return false;
}

function isFullLineComment(s) {
	const t = s.trim();
	if (!t) return false;
	if (t.startsWith('//')) return true;
	if (isBlockCommentLine(s)) return true;
	if (t.startsWith('{/*') || (t.includes('{/*') && t.includes('*/}'))) return true;
	return false;
}

/** Trailing // on code lines (skip URLs, strings heuristic: // after code token) */
function hasCodeTrailingComment(s) {
	if (/https?:\/\//.test(s)) return false;
	const idx = s.indexOf('//');
	if (idx <= 0) return false;
	const before = s.slice(0, idx).trimEnd();
	if (!before) return false;
	return /[;{})\]`'"\w]$/.test(before) || before.endsWith('>') || /\s(if|else|return|=>)\s*$/i.test(before);
}

function skipFile(f) {
	if (!CODE_FILE.test(f)) return true;
	if (f.endsWith('package-lock.json')) return true;
	if (f.includes('/story-formats/') && f.endsWith('format.js')) return true;
	return false;
}

/** @type {{ file: string; kind: string; minus?: string; plus: string }[]} */
const items = [];
let file = '';

const lines = diff.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
	const line = lines[i];
	const m = line.match(/^diff --git a\/(.+) b\/(.+)$/);
	if (m) {
		file = m[2];
		continue;
	}
	if (line.startsWith('Binary files')) continue;
	if (skipFile(file)) continue;

	if (line.startsWith('+') && !line.startsWith('+++')) {
		const content = line.slice(1);
		if (isFullLineComment(content)) {
			items.push({ file, kind: 'added', plus: content });
			continue;
		}
		if (hasCodeTrailingComment(content)) {
			items.push({ file, kind: 'added-inline', plus: content });
		}
	}

	if (line.startsWith('-') && !line.startsWith('---')) {
		const minus = line.slice(1);
		const next = lines[i + 1];
		if (next?.startsWith('+') && !next.startsWith('+++')) {
			const plus = next.slice(1);
			const commentChange =
				isFullLineComment(minus) ||
				isFullLineComment(plus) ||
				(minus.includes('//') &&
					plus.includes('//') &&
					minus.trim() !== plus.trim());
			if (commentChange) {
				items.push({ file, kind: 'changed', minus, plus });
				i++;
			}
		}
	}
}

const byFile = new Map();
for (const it of items) {
	if (!byFile.has(it.file)) byFile.set(it.file, []);
	byFile.get(it.file).push(it);
}

const when = new Date().toISOString().slice(0, 10);
let md = `# Fork comment review (vs ${UPSTREAM_REF})

Generated: ${when} (re-run: \`node scripts/extract-fork-comments.mjs\`)

## Scope

- **Compared to:** \`${UPSTREAM_REF}\` (three-dot diff: merge-base to \`HEAD\`).
- **Files:** \`.ts\`, \`.tsx\`, \`.js\`, \`.jsx\`, \`.mjs\`, \`.cjs\`, \`.css\` only (no \`.md\`, lockfiles, or minified \`format.js\`).
- **Included:** Added full-line comments (\`//\`, \`/* */\`, JSDoc-style \`*\` lines), added lines with trailing \`//\` (heuristic), and paired removed/added lines where comment-related text changed.
- **Not guaranteed:** Comments that moved without edit, or upstream comments you deleted only (no added line in the same hunk). For those, use full \`git diff ${UPSTREAM_REF}...HEAD\`.

---

`;

function escapeMd(s) {
	return String(s)
		.replace(/\\/g, '\\\\')
		.replace(/`/g, '\\`')
		.replace(/\r/g, '')
		.trimEnd();
}

const sortedFiles = [...byFile.keys()].sort();
for (const f of sortedFiles) {
	md += `## \`${f}\`\n\n`;
	for (const it of byFile.get(f)) {
		if (it.kind === 'changed') {
			md += `- **changed**\n`;
			md += `  - old: \`${escapeMd(it.minus)}\`\n`;
			md += `  - new: \`${escapeMd(it.plus)}\`\n\n`;
		} else if (it.kind === 'added-inline') {
			md += `- **added (inline comment)**\n`;
			md += `  - \`${escapeMd(it.plus)}\`\n\n`;
		} else {
			md += `- **added**\n`;
			md += `  - \`${escapeMd(it.plus)}\`\n\n`;
		}
	}
}

const outPath = join(root, 'docs', 'FORK_COMMENT_REVIEW.md');
writeFileSync(outPath, md, 'utf8');
console.log(`Wrote ${items.length} items across ${byFile.size} files to docs/FORK_COMMENT_REVIEW.md`);

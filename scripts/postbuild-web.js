/**
 * Runs after `vite build`: copies dist/web → electron-build/renderer and zips dist/web.
 * Replaces shell one-liners that break on Windows cmd.exe (single quotes, `;` parsing).
 */
'use strict';

const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

async function main() {
	const root = path.join(__dirname, '..');
	const src = path.join(root, 'dist', 'web');
	const dest = path.join(root, 'electron-build', 'renderer');

	if (!(await fs.pathExists(src))) {
		console.error('postbuild-web: dist/web is missing; run vite build first.');
		process.exit(1);
	}

	await fs.emptyDir(dest);
	await fs.copy(src, dest, { overwrite: true });

	const pkg = await fs.readJson(path.join(root, 'package.json'));
	const zipName = `twine-${pkg.version}-web.zip`;
	const distDir = path.join(root, 'dist');

	execSync(`tar -a -c -f "${zipName}" web`, {
		cwd: distDir,
		stdio: 'inherit',
	});
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

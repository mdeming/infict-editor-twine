/**
 * Typecheck + Vite production build with fork extended mode off (upstream-style defaults,
 * no extended format builtin list, no remote embed import in api-initializer). Cross-platform.
 */
'use strict';

const {spawnSync} = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const env = {
	...process.env,
	VITE_TWINE_FORK_EXTENDED: 'false',
	VITE_INFICT_TWINE: 'false'
};

function run(cmd, args) {
	const r = spawnSync(cmd, args, {
		cwd: root,
		stdio: 'inherit',
		shell: true,
		env
	});
	if (r.status !== 0 && r.status !== null) {
		process.exit(r.status);
	}
	if (r.error) {
		throw r.error;
	}
}

run('npx', ['tsc']);
run('npx', ['vite', 'build']);

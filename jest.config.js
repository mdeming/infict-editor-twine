const fs = require('fs');
const path = require('path');

/** Keep in sync with `vite.config.mts` `resolveSnowconeDialogFormsRoot`. */
function resolveDialogFormsRootForJest() {
	if (process.env.VITE_DIALOG_FORMS_ROOT) {
		return path.resolve(__dirname, process.env.VITE_DIALOG_FORMS_ROOT);
	}
	const fromNodeModules = path.join(__dirname, 'node_modules/@infict/dialog-forms');
	if (fs.existsSync(fromNodeModules)) {
		return fromNodeModules;
	}
	return path.resolve(__dirname, '../snowcone/dialog-forms-dist/dialog-forms');
}

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	// Map asset and CSS imports to inert mocks.
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/src/__mocks__/fileMock.js',
		'\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.js',
		'^@twine-fork/dialog-forms$': resolveDialogFormsRootForJest()
	},
	preset: 'ts-jest/presets/js-with-ts',
	resetMocks: true,
	roots: ['<rootDir>/src'],
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	testEnvironment: 'jest-environment-jsdom',
	// segseg is a ESM-only module.
	transformIgnorePatterns: ['node_modules/(?!segseg)'],
	watchPlugins: [
		'jest-watch-typeahead/filename',
		'jest-watch-typeahead/testname'
	]
};

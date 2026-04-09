import {BUNDLED_EXTENDED_FORMAT} from '../fork-build-config';

export {};

describe('getDefaultStoryFormat', () => {
	const originalWindow = global.window;
	const originalEnv = {
		VITE_TWINE_FORK_EXTENDED: process.env.VITE_TWINE_FORK_EXTENDED,
		VITE_INFICT_TWINE: process.env.VITE_INFICT_TWINE,
		VITE_DEFAULT_FORMAT_NAME: process.env.VITE_DEFAULT_FORMAT_NAME,
		VITE_DEFAULT_FORMAT_VERSION: process.env.VITE_DEFAULT_FORMAT_VERSION,
		REACT_APP_DEFAULT_FORMAT_NAME: process.env.REACT_APP_DEFAULT_FORMAT_NAME,
		REACT_APP_DEFAULT_FORMAT_VERSION: process.env.REACT_APP_DEFAULT_FORMAT_VERSION
	};

	function resetEnv() {
		for (const key of Object.keys(originalEnv) as Array<keyof typeof originalEnv>) {
			const v = originalEnv[key];
			if (v === undefined) {
				delete process.env[key];
			} else {
				process.env[key] = v;
			}
		}
	}

	beforeEach(() => {
		jest.resetModules();
		resetEnv();
	});

	afterEach(() => {
		jest.restoreAllMocks();
		global.window = originalWindow;
		resetEnv();
		jest.resetModules();
	});

	it('uses defaultFormat / defaultFormatVersion from URL when window is defined', () => {
		delete process.env.VITE_TWINE_FORK_EXTENDED;
		delete process.env.VITE_INFICT_TWINE;
		jest.spyOn(window, 'location', 'get').mockReturnValue({
			...window.location,
			search: '?defaultFormat=Chapbook&defaultFormatVersion=2.3.0&other=1'
		} as Location);
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const {getDefaultStoryFormat} = require('../format-defaults');
		expect(getDefaultStoryFormat()).toEqual({
			name: 'Chapbook',
			version: '2.3.0'
		});
	});

	it('uses VITE_DEFAULT_FORMAT_* when set and URL does not override', () => {
		(global as any).window = {location: {search: ''}};
		process.env.VITE_DEFAULT_FORMAT_NAME = 'SugarCube';
		process.env.VITE_DEFAULT_FORMAT_VERSION = '2.37.3';
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const {getDefaultStoryFormat} = require('../format-defaults');
		expect(getDefaultStoryFormat()).toEqual({
			name: 'SugarCube',
			version: '2.37.3'
		});
	});

	it('uses REACT_APP_DEFAULT_FORMAT_* when VITE pair is absent', () => {
		(global as any).window = {location: {search: ''}};
		process.env.REACT_APP_DEFAULT_FORMAT_NAME = 'Paperthin';
		process.env.REACT_APP_DEFAULT_FORMAT_VERSION = '1.0.0';
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const {getDefaultStoryFormat} = require('../format-defaults');
		expect(getDefaultStoryFormat()).toEqual({
			name: 'Paperthin',
			version: '1.0.0'
		});
	});

	it('uses bundled extended format when fork build and no overrides', () => {
		delete (global as any).window;
		delete process.env.VITE_TWINE_FORK_EXTENDED;
		delete process.env.VITE_INFICT_TWINE;
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const {getDefaultStoryFormat} = require('../format-defaults');
		expect(getDefaultStoryFormat()).toEqual({
			name: BUNDLED_EXTENDED_FORMAT.name,
			version: BUNDLED_EXTENDED_FORMAT.version
		});
	});

	it('uses Harlowe when upstream-core build and no overrides', () => {
		delete (global as any).window;
		process.env.VITE_TWINE_FORK_EXTENDED = 'false';
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const {getDefaultStoryFormat} = require('../format-defaults');
		expect(getDefaultStoryFormat()).toEqual({
			name: 'Harlowe',
			version: '3.3.9'
		});
	});
});

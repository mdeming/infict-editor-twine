import {
	BUNDLED_EXTENDED_FORMAT,
	isForkExtendedBuild,
	UPSTREAM_DEFAULT_STORY_FORMAT
} from './fork-build-config';

/**
 * Default story format configuration.
 * Can be overridden via environment variables or URL parameters.
 */
export function getDefaultStoryFormat(): { name: string; version: string } {
	// URL query wins (e.g. Controller embedding)
	if (typeof window !== 'undefined') {
		const urlParams = new URLSearchParams(window.location.search);
		const formatName = urlParams.get('defaultFormat');
		const formatVersion = urlParams.get('defaultFormatVersion');
		if (formatName && formatVersion) {
			return { name: formatName, version: formatVersion };
		}
	}

	// Then build-time env (Vite + legacy CRA names)
	const viteName = process.env.VITE_DEFAULT_FORMAT_NAME;
	const viteVersion = process.env.VITE_DEFAULT_FORMAT_VERSION;
	if (viteName && viteVersion) {
		return {name: viteName, version: viteVersion};
	}
	if (
		process.env.REACT_APP_DEFAULT_FORMAT_NAME &&
		process.env.REACT_APP_DEFAULT_FORMAT_VERSION
	) {
		return {
			name: process.env.REACT_APP_DEFAULT_FORMAT_NAME,
			version: process.env.REACT_APP_DEFAULT_FORMAT_VERSION
		};
	}

	// Fallback: bundled default for this build (extended fork vs core)
	return isForkExtendedBuild()
		? {...BUNDLED_EXTENDED_FORMAT}
		: {...UPSTREAM_DEFAULT_STORY_FORMAT};
}

export function isValidTagName(value: string) {
	return value.length > 0 && !/\s/.test(value);
}

/**
 * Strip invisible/zero-width Unicode from tag strings (e.g. U+2063 INVISIBLE SEPARATOR).
 * Such characters often arrive via paste or clipboard normalization and break tag matching.
 */
export function normalizeTag(tag: string): string {
	return tag
		.replace(/[\u200B-\u200F\u2028-\u202F\u2060-\u206F\uFEFF]/g, '')
		.trim();
}

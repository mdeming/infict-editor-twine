import {
	BUNDLED_EXTENDED_FORMAT,
	getBundledExtendedFormatJsUrl,
	isForkExtendedBuild,
	parseExtraBuiltinsFromEnv
} from '../../config/fork-build-config';

export type BuiltinStoryFormatRow = {
	name: string;
	url: string;
	version: string;
	userAdded?: boolean;
};

const builtinsWithoutExtended = (): BuiltinStoryFormatRow[] => [
	{
		name: 'Chapbook',
		url: 'story-formats/chapbook-1.2.3/format.js',
		version: '1.2.3'
	},
	{
		name: 'Chapbook',
		url: 'story-formats/chapbook-2.3.0/format.js',
		version: '2.3.0'
	},
	{
		name: 'Harlowe',
		url: 'story-formats/harlowe-1.2.4/format.js',
		version: '1.2.4'
	},
	{
		name: 'Harlowe',
		url: 'story-formats/harlowe-2.1.0/format.js',
		version: '2.1.0'
	},
	{
		name: 'Harlowe',
		url: 'story-formats/harlowe-3.3.9/format.js',
		version: '3.3.9'
	},
	{
		name: 'Paperthin',
		url: 'story-formats/paperthin-1.0.0/format.js',
		version: '1.0.0'
	},
	{
		name: 'Snowman',
		url: 'story-formats/snowman-1.5.0/format.js',
		version: '1.5.0'
	},
	{
		name: 'Snowman',
		url: 'story-formats/snowman-2.1.1/format.js',
		version: '2.1.1',
		userAdded: false
	},
	{
		name: 'SugarCube',
		url: 'story-formats/sugarcube-1.0.35/format.js',
		version: '1.0.35'
	},
	{
		name: 'SugarCube',
		url: 'story-formats/sugarcube-2.37.3/format.js',
		version: '2.37.3'
	}
];

const bundledExtendedBuiltinRow = (): BuiltinStoryFormatRow => ({
	name: BUNDLED_EXTENDED_FORMAT.name,
	url: getBundledExtendedFormatJsUrl(),
	version: BUNDLED_EXTENDED_FORMAT.version
});

function mergeExtraBuiltins(
	primary: BuiltinStoryFormatRow[],
	extras: ReturnType<typeof parseExtraBuiltinsFromEnv>
): BuiltinStoryFormatRow[] {
	if (extras.length === 0) {
		return primary;
	}
	const urls = new Set(primary.map(p => p.url));
	const out = [...primary];
	for (const e of extras) {
		if (!urls.has(e.url)) {
			urls.add(e.url);
			out.push({
				name: e.name,
				url: e.url,
				version: e.version,
				userAdded: false
			});
		}
	}
	return out;
}

const builtinsAll = (): BuiltinStoryFormatRow[] => {
	const withoutExt = builtinsWithoutExtended();
	const withExt = [
		...withoutExt.slice(0, 8),
		bundledExtendedBuiltinRow(),
		...withoutExt.slice(8)
	];
	return mergeExtraBuiltins(withExt, parseExtraBuiltinsFromEnv());
};

/** Builtin story formats shipped with the app. Extended format is omitted when `VITE_TWINE_FORK_EXTENDED=false`. */
export const builtins = () =>
	isForkExtendedBuild()
		? builtinsAll()
		: builtinsAll().filter(f => f.name !== BUNDLED_EXTENDED_FORMAT.name);

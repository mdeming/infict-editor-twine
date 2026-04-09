import * as React from 'react';
import {
	BUNDLED_EXTENDED_FORMAT,
	isForkExtendedBuild
} from '../config/fork-build-config';
import {SNOWCONE_MAP_LEGEND_FALLBACK} from '../config/snowcone-map-legend-fallback';
import {formatEditorExtensions} from '../util/story-format';
import {
	formatWithNameAndVersion,
	loadFormatProperties,
	useStoryFormatsContext
} from './story-formats';
import {formatEditorExtensionsDisabled, usePrefsContext} from './prefs';
import {getAppInfo} from '../util/app-info';
import type {ConnectionLegend} from './story-formats/story-formats.types';

export function useFormatConnectionLegend(
	formatName: string,
	formatVersion: string
): ConnectionLegend | null {
	const {prefs} = usePrefsContext();
	const {dispatch, formats} = useStoryFormatsContext();
	const format = formatWithNameAndVersion(formats, formatName, formatVersion);
	const extensionsDisabled = formatEditorExtensionsDisabled(
		prefs,
		formatName,
		formatVersion
	);

	React.useEffect(() => {
		if (extensionsDisabled) {
			return;
		}

		if (format.loadState === 'unloaded') {
			dispatch(loadFormatProperties(format));
		}
	}, [dispatch, extensionsDisabled, format]);

	const editorExtensions = React.useMemo(() => {
		if (extensionsDisabled || format.loadState !== 'loaded') {
			return undefined;
		}
		return formatEditorExtensions(format, getAppInfo().version);
	}, [extensionsDisabled, format, format.loadState]);

	if (extensionsDisabled) {
		return null;
	}

	const fromFormat = editorExtensions?.connectionLegend ?? null;
	const hasItems = Boolean(fromFormat?.items?.length);
	const useSnowconeFallback =
		isForkExtendedBuild() &&
		formatName === BUNDLED_EXTENDED_FORMAT.name &&
		formatVersion === BUNDLED_EXTENDED_FORMAT.version &&
		format.loadState === 'loaded' &&
		typeof editorExtensions?.connectionStyle === 'function' &&
		!hasItems;

	const legend: ConnectionLegend | null = useSnowconeFallback
		? SNOWCONE_MAP_LEGEND_FALLBACK
		: fromFormat;

	if (!legend?.items?.length) {
		return null;
	}
	return legend;
}

import * as React from 'react';
import {formatEditorExtensions} from '../util/story-format';
import {
	formatWithNameAndVersion,
	loadFormatProperties,
	useStoryFormatsContext
} from './story-formats';
import {formatEditorExtensionsDisabled, usePrefsContext} from './prefs';
import {getAppInfo} from '../util/app-info';

const CONNECTION_STYLE_DEBUG_KEY = 'twine.debugConnectionStyle';

function isConnectionStyleDebugEnabled(): boolean {
	return (
		process.env.NODE_ENV === 'development' ||
		(typeof localStorage !== 'undefined' && localStorage.getItem(CONNECTION_STYLE_DEBUG_KEY) === '1')
	);
}

export type ConnectionStyleFn = (
	description: string
) => { colorClass?: string; markerId?: string } | null;

export function useFormatConnectionStyle(
	formatName: string,
	formatVersion: string
): ConnectionStyleFn | null {
	const {prefs} = usePrefsContext();
	const {dispatch, formats} = useStoryFormatsContext();
	const format = formatWithNameAndVersion(formats, formatName, formatVersion);
	const [editorExtensions, setEditorExtensions] =
		React.useState<ReturnType<typeof formatEditorExtensions>>();
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
		} else if (format.loadState === 'loaded') {
			setEditorExtensions(formatEditorExtensions(format, getAppInfo().version));
		}
	}, [dispatch, extensionsDisabled, format]);

	if (extensionsDisabled) {
		if (isConnectionStyleDebugEnabled()) {
			console.debug('[ConnectionStyle]', formatName, formatVersion, 'extensions disabled by user');
		}
		return null;
	}

	const connectionStyleFn = editorExtensions?.connectionStyle ?? null;
	if (isConnectionStyleDebugEnabled() && connectionStyleFn) {
		const props = format.loadState === 'loaded' ? format.properties : undefined;
		console.debug('[ConnectionStyle]', formatName, formatVersion, {
			loadState: format.loadState,
			hasEditorExtensions: !!props?.editorExtensions,
			hasTwine: !!props?.editorExtensions?.twine,
			hasConnectionStyle: !!connectionStyleFn
		});
	}
	return connectionStyleFn;
}

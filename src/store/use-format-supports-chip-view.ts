import * as React from 'react';
import {formatEditorExtensions} from '../util/story-format';
import {loadFormatProperties, useStoryFormatsContext} from './story-formats';
import {formatEditorExtensionsDisabled, usePrefsContext} from './prefs';
import {getAppInfo} from '../util/app-info';

/**
 * True when the loaded story format’s Twine editor extensions include `supportsChipView`.
 */
export function useFormatSupportsChipView(
	formatName: string,
	formatVersion: string
): boolean {
	const {prefs} = usePrefsContext();
	const {dispatch, formats} = useStoryFormatsContext();
	const format =
		formats.find(f => f.name === formatName && f.version === formatVersion) ??
		null;
	const [supports, setSupports] = React.useState(false);
	const extensionsDisabled = formatEditorExtensionsDisabled(
		prefs,
		formatName,
		formatVersion
	);

	React.useEffect(() => {
		if (!format) {
			setSupports(false);
			return;
		}
		if (extensionsDisabled) {
			setSupports(false);
			return;
		}

		switch (format.loadState) {
			case 'unloaded':
				dispatch(loadFormatProperties(format));
				setSupports(false);
				break;
			case 'loading':
				setSupports(false);
				break;
			case 'loaded': {
				const ext = formatEditorExtensions(format, getAppInfo().version) as
					| {supportsChipView?: boolean}
					| undefined;
				setSupports(ext?.supportsChipView === true);
				break;
			}
			case 'error':
				setSupports(false);
				break;
		}
	}, [dispatch, extensionsDisabled, format]);

	if (!format) {
		return false;
	}
	return supports && !extensionsDisabled;
}

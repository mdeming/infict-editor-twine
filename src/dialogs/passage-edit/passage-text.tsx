import * as React from 'react';
import {BUNDLED_EXTENDED_FORMAT} from '../../config/fork-build-config';
import {PassageTextPlain} from './passage-text-plain';
import type {PassageTextProps} from './passage-text-types';

export type {PassageTextProps} from './passage-text-types';

const PassageTextExtendedLazy = React.lazy(() =>
	import('./passage-text-extended').then(m => ({default: m.PassageTextExtended}))
);

function useExtendedPassageCommandEditorPath(props: PassageTextProps): boolean {
	return (
		props.storyFormat.name === BUNDLED_EXTENDED_FORMAT.name &&
		!props.storyFormatExtensionsDisabled
	);
}

/**
 * Routes to the extended-format passage editor (chips, passage command editor) or the
 * standard Twine editor. The extended implementation is lazy-loaded so other
 * formats do not pull the Snowcone dialog-forms chunk.
 */
export const PassageText: React.FC<PassageTextProps> = props => {
	if (useExtendedPassageCommandEditorPath(props)) {
		return (
			<React.Suspense fallback={null}>
				<PassageTextExtendedLazy {...props} />
			</React.Suspense>
		);
	}
	return <PassageTextPlain {...props} />;
};

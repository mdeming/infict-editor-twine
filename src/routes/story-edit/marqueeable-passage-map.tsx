import * as React from 'react';
import {
	MarqueeSelection,
	MarqueeSelectionProps
} from '../../components/marquee-selection';
import {ConnectionStyleLegend} from '../../components/passage/passage-connections/connection-style-legend';
import {
	PassageMap,
	PassageMapProps
} from '../../components/passage/passage-map';
import {useFormatConnectionLegend} from '../../store/use-format-connection-legend';
import {Rect, rectsIntersect} from '../../util/geometry';

export interface MarqueeablePassageMapProps
	extends PassageMapProps,
		Omit<
			MarqueeSelectionProps,
			'ignoreEventsOnSelector' | 'onTemporarySelectRect'
		> {}

/**
 * Marries a MarqueeSelection with a PassageMap. This handles displaying a
 * temporary selection while the user drags around the marquee selection
 * *without* persisting the change, for performance.
 */
export const MarqueeablePassageMap: React.FC<
	MarqueeablePassageMapProps
> = props => {
	const {container, onSelectRect, formatName, formatVersion, visibleZoom, ...other} =
		props;
	const connectionLegend = useFormatConnectionLegend(formatName, formatVersion);
	const [temporaryRect, setTemporaryRect] = React.useState<Rect>();
	const [temporaryAdditive, setTemporaryAdditive] = React.useState<boolean>();
	const innerPassages = React.useMemo(() => {
		if (!temporaryRect) {
			return props.passages;
		}

		return props.passages.map(passage => {
			if (temporaryAdditive && passage.selected) {
				return passage;
			}

			const selected = rectsIntersect(temporaryRect, passage);

			if (selected === passage.selected) {
				return passage;
			}

			return {...passage, selected};
		});
	}, [props.passages, temporaryAdditive, temporaryRect]);

	const handleTemporarySelectRect = React.useCallback(
		(rect: Rect, additive: boolean) => {
			setTemporaryRect({
				height: rect.height / props.zoom,
				left: rect.left / props.zoom,
				top: rect.top / props.zoom,
				width: rect.width / props.zoom
			});
			setTemporaryAdditive(additive);
		},
		[props.zoom]
	);

	const handleSelectRect = React.useCallback(
		(rect: Rect, additive: boolean) => {
			setTemporaryRect(undefined);
			setTemporaryAdditive(undefined);
			onSelectRect(rect, additive);
		},
		[onSelectRect]
	);

	return (
		<>
			<MarqueeSelection
				container={container}
				ignoreEventsOnSelector=".passage-card, .fuzzy-finder, .zoom-buttons, .connection-style-legend"
				onSelectRect={handleSelectRect}
				onTemporarySelectRect={handleTemporarySelectRect}
			/>
			<PassageMap
				{...other}
				formatName={formatName}
				formatVersion={formatVersion}
				passages={innerPassages}
				visibleZoom={visibleZoom}
			/>
			<ConnectionStyleLegend
				fixedViewport
				legend={connectionLegend}
			/>
		</>
	);
};

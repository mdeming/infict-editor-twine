import * as React from 'react';
import {Passage, passageConnections} from '../../../store/stories';
import {Point} from '../../../util/geometry';
import {PassageConnectionGroup} from './passage-connection-group';
import {LinkMarkers} from './link-markers';
import {StartConnection} from './start-connection';
import {useFormatConnectionStyle} from '../../../store/use-format-connection-style';
import {useFormatReferenceParser} from '../../../store/use-format-reference-parser';

export interface PassageConnectionsProps {
	formatName: string;
	formatVersion: string;
	offset: Point;
	passages: Passage[];
	startPassageId: string;
}

const emptySet = new Set<Passage>();
const noOffset: Point = {left: 0, top: 0};

export const PassageConnections: React.FC<PassageConnectionsProps> = props => {
	const {formatName, formatVersion, offset, passages, startPassageId} = props;
	const connectionStyle = useFormatConnectionStyle(formatName, formatVersion);
	const referenceParser = useFormatReferenceParser(formatName, formatVersion);
	const {draggable: draggableLinks, fixed: fixedLinks} = React.useMemo(
		() => passageConnections(passages),
		[passages]
	);
	const {
		draggable: draggableReferences,
		fixed: fixedReferences
	} = React.useMemo(() => passageConnections(passages, referenceParser), [
		passages,
		referenceParser
	]);

	const startPassage = React.useMemo(
		() => passages.find(passage => passage.id === startPassageId),
		[passages, startPassageId]
	);

	// References only show existing connections.

	return (
		<svg className="link-connectors">
			<LinkMarkers />
			{startPassage && (
				<StartConnection offset={offset} passage={startPassage} />
			)}
			<PassageConnectionGroup
				{...draggableLinks}
				connectionStyle={connectionStyle}
				offset={offset}
			/>
			<PassageConnectionGroup
				{...fixedLinks}
				connectionStyle={connectionStyle}
				offset={noOffset}
			/>
			<PassageConnectionGroup
				broken={emptySet}
				connectionStyle={connectionStyle}
				connections={draggableReferences.connections}
				offset={offset}
				self={emptySet}
				variant="reference"
			/>
			<PassageConnectionGroup
				broken={emptySet}
				connectionStyle={connectionStyle}
				connections={fixedReferences.connections}
				offset={noOffset}
				self={emptySet}
				variant="reference"
			/>
		</svg>
	);
};

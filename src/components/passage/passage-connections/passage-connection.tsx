import * as React from 'react';
import {arc, arcPointOffsetAlongOutwardNormal, ArcProps} from '../../../util/svg';
import {
	lineAngle,
	lineDistance,
	rectCenter,
	rectIntersectionWithLine,
	Point
} from '../../../util/geometry';
import {Passage} from '../../../store/stories';
import {ConnectionStyleFn} from '../../../store/use-format-connection-style';
import {CONNECTION_STROKE} from './connection-style-stroke';
import './passage-connection.css';

function isConnectionStyleDebugEnabled(): boolean {
	return (
		process.env.NODE_ENV === 'development' ||
		(typeof localStorage !== 'undefined' && localStorage.getItem('twine.debugConnectionStyle') === '1')
	);
}

export interface PassageConnectionProps {
	connectionStyle?: ConnectionStyleFn | null;
	description?: string;
	end: Passage;
	offset: Point;
	start: Passage;
	variant: 'link' | 'reference';
}

// Default stroke/arrowhead color when no style applies (uses CSS var for light/dark mode)
const DEFAULT_STROKE = 'var(--gray)';

/** Fixed map-units offset along the curve normal so icons clear the stroke equally on short and long arcs */
const CONNECTION_ICON_NORMAL_OFFSET = 10;

// Function to determine link color from description
const getLinkColor = (description?: string): string => {
	if (!description) {
		return ''; // Default color from CSS
	}

	// Different prefixes for different colors
	if (description.startsWith('red:')) {
		return 'red-link';
	} else if (description.startsWith('green:')) {
		return 'green-link';
	} else if (description.startsWith('blue:')) {
		return 'blue-link';
	} else if (description.startsWith('purple:')) {
		return 'purple-link';
	} else if (description.startsWith('orange:')) {
		return 'orange-link';
	}

	return '';
};

export const PassageConnection: React.FC<PassageConnectionProps> = props => {
	const {connectionStyle, end, offset, start, variant, description} = props;
	// Use description (part before ->) when present; otherwise use link target so plain [[SMS::foo]] links can be styled
	const labelForStyle = description ?? end?.name ?? '';
	const formatStyle =
		connectionStyle && labelForStyle
			? connectionStyle(labelForStyle)
			: null;
	const colorClass =
		formatStyle?.colorClass ?? (connectionStyle ? '' : getLinkColor(description));
	// Icon at midpoint (when format provides one); arrow always at end
	const markerMid =
		formatStyle?.markerId != null ? `url(#${formatStyle.markerId})` : undefined;
	const markerEnd = 'url(#link-arrowhead)';
	// Debug: log when connectionStyle is used (dev or twine.debugConnectionStyle) to verify format + labels
	if (isConnectionStyleDebugEnabled() && connectionStyle && labelForStyle) {
		console.debug('[ConnectionStyle] link', {
			labelForStyle: labelForStyle.slice(0, 40),
			formatStyle: formatStyle ? { colorClass: formatStyle.colorClass, markerId: formatStyle.markerId } : null,
			applied: { colorClass, markerMid: markerMid ?? null, markerEnd }
		});
	}

	const arcProps = React.useMemo((): ArcProps | null => {
		// If either passage is selected, offset it. We need to take care not to
		// overwrite the passage information.

		let offsetStart = start;
		let offsetEnd = end;

		if (start.selected) {
			offsetStart = {
				...start,
				left: start.left + offset.left,
				top: start.top + offset.top
			};
		}

		if (end.selected) {
			offsetEnd = {
				...end,
				left: end.left + offset.left,
				top: end.top + offset.top
			};
		}

		// Start at the center of both passages.

		let startPoint: Point | null = rectCenter(offsetStart);
		let endPoint: Point | null = rectCenter(offsetEnd);

		// Move both points to where they intersect with the edges of their passages.

		startPoint = rectIntersectionWithLine(offsetStart, startPoint, endPoint);

		if (!startPoint) {
			return null;
		}

		endPoint = rectIntersectionWithLine(offsetEnd, startPoint, endPoint);

		if (!endPoint) {
			return null;
		}

		// Draw a flattened arc, to make it easier to distinguish between links
		// between passages with the same horizontal or vertical position (which
		// would otherwise be overlapping flat lines).
		//
		// The horizontal radius of our arc is proportional to the distance
		// the line will travel.

		const distance = lineDistance(startPoint, endPoint);

		// Rotate the arc so that its underside will always face downward. We cheat
		// vertical lines so that their undersides face right--an aesthetic choice,
		// and so that bidirectional links line up.

		let sweep = startPoint.left < endPoint.left;

		if (startPoint.left === endPoint.left && startPoint.top < endPoint.top) {
			sweep = true;
		}

		const angle = lineAngle(startPoint, endPoint);

		// The Y radius is another aesthetic choice. The lower the ratio, the less
		// curved the lines become.

		return {
			start: startPoint,
			end: endPoint,
			radius: {left: distance, top: distance * 0.75},
			rotation: angle,
			sweep
		};
	}, [end, offset.left, offset.top, start]);

	// Always use a single arc for the path (no splitting)
	const path = arcProps && arc(arcProps);

	// Icon offset a fixed distance along the perpendicular at t=0.5 (into the arc bulge)
	const midpoint =
		arcProps && formatStyle?.markerId != null
			? arcPointOffsetAlongOutwardNormal(arcProps, 0.5, CONNECTION_ICON_NORMAL_OFFSET)
			: null;

	// Combine CSS classes for base styling, variant, and color
	const classNames = [`passage-connection`, `variant-${variant}`];
	if (colorClass) {
		classNames.push(colorClass);
	}

	const strokeColor = colorClass ? CONNECTION_STROKE[colorClass] : DEFAULT_STROKE;

	// Render path + optional icon at midpoint. stroke and color both set so arrowhead (fill: currentColor) matches line
	return (
		<g>
			<path
				d={path ?? ''}
				className={classNames.join(' ')}
				style={{
					markerEnd,
					stroke: strokeColor,
					color: strokeColor
				}}
			/>
			{midpoint && formatStyle?.markerId && (
				<use
					href={`#${formatStyle.markerId}-icon`}
					x={midpoint.left - 10}
					y={midpoint.top - 10}
					width="20"
					height="20"
					style={{ color: strokeColor }}
				/>
			)}
		</g>
	);
};

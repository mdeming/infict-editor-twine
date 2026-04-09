import classnames from 'classnames';
import * as React from 'react';
import {createPortal} from 'react-dom';
import type {ConnectionLegend} from '../../../store/story-formats/story-formats.types';
import {CONNECTION_STROKE} from './connection-style-stroke';
import './connection-style-legend.css';

export interface ConnectionStyleLegendProps {
	fixedViewport?: boolean;
	legend: ConnectionLegend | null;
	/** When embedded in the scaled passage map, counteract map zoom so the panel stays readable. */
	visibleZoom?: number;
}

/**
 * Optional story map legend for connection-style slots (driven by story format editorExtensions).
 */
export const ConnectionStyleLegend: React.FC<ConnectionStyleLegendProps> = ({
	fixedViewport,
	legend,
	visibleZoom = 1
}) => {
	if (!legend?.items?.length) {
		return null;
	}

	const inverse = !fixedViewport && visibleZoom > 0 ? 1 / visibleZoom : 1;

	const panel = (
		<div
			aria-label={legend.title ?? 'Connection styles'}
			className={classnames('connection-style-legend', {
				'connection-style-legend--map-embedded': !fixedViewport,
				'connection-style-legend--viewport-fixed': fixedViewport
			})}
			role="region"
			style={
				!fixedViewport
					? {
							transform: `scale(${inverse})`,
							transformOrigin: 'bottom left'
						}
					: undefined
			}
		>
			{legend.title && (
				<div className="connection-style-legend-title">{legend.title}</div>
			)}
			<ul className="connection-style-legend-list">
				{legend.items.map((item, i) => {
					const stroke = CONNECTION_STROKE[item.colorClass] ?? 'var(--gray)';
					return (
						<li className="connection-style-legend-row" key={`${item.colorClass}-${i}`}>
							<span
								aria-hidden
								className="connection-style-legend-swatch"
								style={{backgroundColor: stroke}}
							/>
							{item.markerId && (
								<svg
									aria-hidden
									className="connection-style-legend-icon"
									height={16}
									style={{color: stroke}}
									width={16}
								>
									<use href={`#${item.markerId}-icon`} />
								</svg>
							)}
							<span className="connection-style-legend-label">{item.label}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);

	if (fixedViewport && typeof document !== 'undefined') {
		return createPortal(panel, document.body);
	}

	return panel;
};

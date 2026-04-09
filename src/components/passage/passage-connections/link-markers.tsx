import * as React from 'react';
import './link-markers.css';

/**
 * Arrowheads used on connectors. Arrowheads must be applied by an inline style.
 * There seems to be disagreement on the proper way to implement this, but it
 * does not work in an external stylesheet in Firefox.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker
 */
export const LinkMarkers: React.FC = () => (
	<defs>
		<marker
			id="link-arrowhead"
			refX="6"
			refY="4"
			markerWidth="8"
			markerHeight="8"
			orient="auto"
		>
			<path d="M 1,1 7,4 1,7 Z" fill="currentColor" />
		</marker>
		<marker
			id="link-broken"
			refX="7.5"
			refY="7.5"
			markerWidth="15"
			markerHeight="15"
		>
			<circle cx="7.5" cy="7.5" r="7.5" />
			<path d="M4.5 7.5h 6z" />
		</marker>
		<marker
			id="link-start"
			markerWidth="15"
			markerHeight="15"
			refX="16"
			refY="16"
			viewBox="0 0 32 32"
		>
			<circle cx="16" cy="16" r="16" />
			<path d="M8 17a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
			<path d="M11 18a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
			<circle className="fill-white" cx="19" cy="13" r="1" />
		</marker>
		{/* Format-specific markers (Snowcone: 1=SMS, 2=Email, 3=Location, 4=Phone, 5=Hook, 6=Set, 7=Webhook, 8=Response).
		    orient="0" keeps icons right-side up (not rotated with the curve). */}
		<marker
			id="link-marker-1"
			refX="8"
			refY="4"
			markerWidth="14"
			markerHeight="14"
			orient="0"
			viewBox="0 0 8 8"
		>
			{/* Message bubble (SMS/text) - smaller rect, larger triangular tail */}
			<path d="M2 1.5h4c.6 0 1 .5 1 1v1.5c0 .6-.5 1-1 1H3.2L2 6.5V5.2h-1c-.6 0-1-.5-1-1V2.5c0-.6.5-1 1-1h1z" fill="currentColor" />
		</marker>
		<marker
			id="link-marker-2"
			refX="8"
			refY="4"
			markerWidth="14"
			markerHeight="14"
			orient="0"
			viewBox="0 0 8 8"
		>
			{/* Envelope (Email) */}
			<path d="M1 2h6v4H1V2zm1 1v2h4V3H2z" fill="currentColor" />
			<path d="M1 3l3 2 3-2" fill="none" stroke="currentColor" strokeWidth="0.5" />
		</marker>
		<marker
			id="link-marker-3"
			refX="8"
			refY="4"
			markerWidth="14"
			markerHeight="14"
			orient="0"
			viewBox="0 0 8 8"
		>
			{/* Map pin (Location) - thin pin with dot below */}
			<path d="M4 0.5c-1 0-1.8 0.8-1.8 1.8 0 1.2 1.2 2.2 1.8 3 0.6-0.8 1.8-1.8 1.8-3C5.8 1.3 5 0.5 4 0.5z" fill="currentColor" />
			<circle cx="4" cy="7" r="0.6" fill="currentColor" />
		</marker>
		<marker
			id="link-marker-4"
			refX="8"
			refY="4"
			markerWidth="14"
			markerHeight="14"
			orient="0"
			viewBox="0 0 8 8"
		>
			{/* Old phone handset - curved bar (earpiece top-left, mouthpiece bottom-right) */}
			<path
				d="M2.5 2.2Q4 4 5.5 6"
				fill="none"
				stroke="currentColor"
				strokeWidth="0.9"
				strokeLinecap="round"
			/>
		</marker>
		<marker
			id="link-marker-5"
			refX="8"
			refY="4"
			markerWidth="14"
			markerHeight="14"
			orient="0"
			viewBox="0 0 8 8"
		>
			{/* Hook (star = code/special action) */}
			<path
				d="M4 1.5l0.5 1.5h1.5L5.2 4l0.8 1.5H4.5L4 7l-0.5-1.5H2L2.8 4 2 2.5h1.5L4 1.5z"
				fill="currentColor"
			/>
		</marker>
		<marker
			id="link-marker-6"
			refX="8"
			refY="4"
			markerWidth="14"
			markerHeight="14"
			orient="0"
			viewBox="0 0 8 8"
		>
			{/* Set / variable (circle with plus) */}
			<circle cx="4" cy="4" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
			<path d="M4 1.5v1M4 5.5v1M1.5 4h1M5.5 4h1" stroke="currentColor" strokeWidth="0.5" />
		</marker>
		<marker
			id="link-marker-7"
			refX="8"
			refY="4"
			markerWidth="14"
			markerHeight="14"
			orient="0"
			viewBox="0 0 8 8"
		>
			{/* Webhook (plug/payload) */}
			<path
				d="M2 5c0-1 1-2 2-2s2 1 2 2v1H2V5zm1 0c0-.5.5-1 1-1s1 .5 1 1H3z"
				fill="currentColor"
			/>
		</marker>
		<marker
			id="link-marker-8"
			refX="8"
			refY="4"
			markerWidth="14"
			markerHeight="14"
			orient="0"
			viewBox="0 0 8 8"
		>
			{/* Response / document */}
			<path d="M2 2h4v4H2V2zm1 1v2h2V3H3z" fill="currentColor" />
		</marker>

		{/* Symbol versions of icons for positioning at arc midpoints (used with <use>) */}
		<symbol id="link-marker-1-icon" viewBox="0 0 8 8">
			{/* Message bubble (SMS/text) - smaller rect, larger triangular tail */}
			<path d="M2 1.5h4c.6 0 1 .5 1 1v1.5c0 .6-.5 1-1 1H3.2L2 6.5V5.2h-1c-.6 0-1-.5-1-1V2.5c0-.6.5-1 1-1h1z" fill="currentColor" />
		</symbol>
		<symbol id="link-marker-2-icon" viewBox="0 0 8 8">
			{/* Envelope (Email) */}
			<path d="M1 2h6v4H1V2zm1 1v2h4V3H2z" fill="currentColor" />
			<path d="M1 3l3 2 3-2" fill="none" stroke="currentColor" strokeWidth="0.5" />
		</symbol>
		<symbol id="link-marker-3-icon" viewBox="0 0 8 8">
			{/* Map pin (Location) - thin pin with dot below */}
			<path d="M4 0.5c-1 0-1.8 0.8-1.8 1.8 0 1.2 1.2 2.2 1.8 3 0.6-0.8 1.8-1.8 1.8-3C5.8 1.3 5 0.5 4 0.5z" fill="currentColor" />
			<circle cx="4" cy="7" r="0.6" fill="currentColor" />
		</symbol>
		<symbol id="link-marker-4-icon" viewBox="0 0 8 8">
			{/* Old phone handset - curved bar */}
			<path d="M2.5 2.2Q4 4 5.5 6" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
		</symbol>
		<symbol id="link-marker-5-icon" viewBox="0 0 8 8">
			{/* Hook (star = code/special action) */}
			<path d="M4 1.5l0.5 1.5h1.5L5.2 4l0.8 1.5H4.5L4 7l-0.5-1.5H2L2.8 4 2 2.5h1.5L4 1.5z" fill="currentColor" />
		</symbol>
		<symbol id="link-marker-6-icon" viewBox="0 0 8 8">
			{/* Set / variable (circle with plus) */}
			<circle cx="4" cy="4" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
			<path d="M4 1.5v1M4 5.5v1M1.5 4h1M5.5 4h1" stroke="currentColor" strokeWidth="0.5" />
		</symbol>
		<symbol id="link-marker-7-icon" viewBox="0 0 8 8">
			{/* Webhook (plug/payload) */}
			<path d="M2 5c0-1 1-2 2-2s2 1 2 2v1H2V5zm1 0c0-.5.5-1 1-1s1 .5 1 1H3z" fill="currentColor" />
		</symbol>
		<symbol id="link-marker-8-icon" viewBox="0 0 8 8">
			{/* Response / document */}
			<path d="M2 2h4v4H2V2zm1 1v2h2V3H3z" fill="currentColor" />
		</symbol>
	</defs>
);

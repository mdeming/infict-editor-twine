import type {ConnectionLegend} from '../store/story-formats/story-formats.types';

/**
 * Mirrors Snowcone `connectionLegend` when a deployed `format.js` predates that
 * export but still ships `connectionStyle` (map coloring). TwineJS can show the
 * legend without waiting for format redeploy.
 */
export const SNOWCONE_MAP_LEGEND_FALLBACK: ConnectionLegend = {
	title: 'Action links',
	items: [
		{label: 'SMS', colorClass: 'connection-style-1', markerId: 'link-marker-1'},
		{label: 'Email', colorClass: 'connection-style-2', markerId: 'link-marker-2'},
		{label: 'Location', colorClass: 'connection-style-3', markerId: 'link-marker-3'},
		{label: 'Phone', colorClass: 'connection-style-4', markerId: 'link-marker-4'},
		{label: 'Hook', colorClass: 'connection-style-5', markerId: 'link-marker-5'},
		{label: 'Set', colorClass: 'connection-style-6', markerId: 'link-marker-6'},
		{label: 'Webhook', colorClass: 'connection-style-7', markerId: 'link-marker-7'},
		{label: 'Response', colorClass: 'connection-style-8', markerId: 'link-marker-8'}
	]
};

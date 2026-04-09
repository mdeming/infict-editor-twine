/**
 * Chip ↔ JSON helpers backed by Snowcone dialog-forms.
 * Loads `getPassageCommandFormsModule()` lazily so `window.__twinePassageCommandForms` (and legacy keys)
 * are not required until `convertJsonToChips` / `restoreJsonFromChips` run.
 */
import {getPassageCommandFormsModule} from './passage-command-forms-module';

export interface ChipMapping {
	placeholder: string;
	originalJson: string;
	chipData: {
		type: string;
		command?: string;
		args?: Record<string, any>;
	};
	index: number;
}

let chipRendererSingleton: {
	convertToChips: (
		text: string,
		options?: {placeholderFormat?: string}
	) => {processedText: string; mappings: ChipMapping[]};
	restoreFromChips: (text: string, mappings: ChipMapping[]) => string;
} | undefined;

function getChipRenderer() {
	if (!chipRendererSingleton) {
		const {ChipRenderer: PassageCommandFormsChipRenderer} =
			getPassageCommandFormsModule();
		chipRendererSingleton = new PassageCommandFormsChipRenderer();
	}
	return chipRendererSingleton;
}

export function convertJsonToChips(
	text: string,
	options: {placeholderFormat?: string} = {}
): {processedText: string; mappings: ChipMapping[]} {
	return getChipRenderer().convertToChips(text, options);
}

export function restoreJsonFromChips(
	text: string,
	mappings: ChipMapping[]
): string {
	return getChipRenderer().restoreFromChips(text, mappings);
}

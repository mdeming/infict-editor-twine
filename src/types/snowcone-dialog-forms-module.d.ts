/** Ambient types for `@infict/dialog-forms` (Vite alias `@twine-fork/dialog-forms`). See `src/config/snowcone-passage-command-editor.ts`. */
declare module '@twine-fork/dialog-forms' {
	export const DialogFormFactory: any;
	export class CodeMirrorAdapter {
		constructor(editor: any);
		insertText(text: string, position?: any): any;
		replaceText(text: string, from: any, to: any): any;
		getText(from?: any, to?: any): string;
		makeTextInteractive(from: any, to: any, text: string): any;
	}

	export class StoryContextClient {
		constructor(options?: {configLoader?: {getStoryConfig(storyId: string): Promise<any>}});
		getNPCs(storyId: string): Promise<Array<{id: string; name: string}>>;
	}

	export const storyContextClient: StoryContextClient;

	export interface DialogFormsAPI {
		scanner?: any;
		editorAdapter?: any;
		createRequestForm: (type: string, options?: any) => any;
		createResponseForm: (type: string, options?: any) => any;
		showRequestSelector: (options?: any) => void;
		showResponseSelector: (options?: any) => void;
	}

	export function initialize(options?: {
		editorAdapter?: any;
		enableScanning?: boolean;
	}): DialogFormsAPI;
	export function parseJsonResponse(text: string): any;
	export function parseRequestFormat(text: string): any;
	export function getViewMode(editorId: string, defaultMode?: string): string;
	export function saveViewMode(editorId: string, mode: string): void;
	export function getChipDefinition(commandType: string): {
		icon: string;
		label: string;
		backgroundColor: string;
		borderColor: string;
		textColor: string;
	};

	export interface ChipMapping {
		placeholder: string;
		originalJson: string;
		chipData: {
			type: string;
			command?: string;
			args?: any;
		};
		index: number;
	}

	export class ChipRenderer {
		convertToChips(text: string, options?: {placeholderFormat?: string}): {processedText: string; mappings: ChipMapping[]};
		restoreFromChips(text: string, mappings: ChipMapping[]): string;
	}

	export class CodeMirrorChipManager {
		constructor(editor: any, options?: {onChipClick?: (chipData: any, originalJson: string, position?: {from: {line: number; ch: number}; to: {line: number; ch: number}}) => void});
		convertToChips(text: string, existingMappings?: ChipMapping[]): {processedText: string; mappings: ChipMapping[]};
		renderChips(text: string, existingMappings?: ChipMapping[]): {processedText: string; mappings: ChipMapping[]};
		applyMarkers(processedText: string, mappings: ChipMapping[]): void;
		clearMarkers(): void;
		getChipAtPosition(pos: {line: number; ch: number}): ChipMapping | null;
		getChipMappingAtPosition(pos: {line: number; ch: number}): {mapping: ChipMapping; position: {from: {line: number; ch: number}; to: {line: number; ch: number}}} | null;
	}
}

declare module '@infict/dialog-forms' {
	export const DialogFormFactory: any;
	export class CodeMirrorAdapter {
		constructor(editor: any);
		insertText(text: string, position?: any): any;
		replaceText(text: string, from: any, to: any): any;
		getText(from?: any, to?: any): string;
		makeTextInteractive(from: any, to: any, text: string): any;
	}

	export class StoryContextClient {
		constructor(options?: {configLoader?: {getStoryConfig(storyId: string): Promise<any>}});
		getNPCs(storyId: string): Promise<Array<{id: string; name: string}>>;
	}

	export const storyContextClient: StoryContextClient;

	export interface DialogFormsAPI {
		scanner?: any;
		editorAdapter?: any;
		createRequestForm: (type: string, options?: any) => any;
		createResponseForm: (type: string, options?: any) => any;
		showRequestSelector: (options?: any) => void;
		showResponseSelector: (options?: any) => void;
	}

	export function initialize(options?: {
		editorAdapter?: any;
		enableScanning?: boolean;
	}): DialogFormsAPI;
	export function parseJsonResponse(text: string): any;
	export function parseRequestFormat(text: string): any;
	export function getViewMode(editorId: string, defaultMode?: string): string;
	export function saveViewMode(editorId: string, mode: string): void;
	export function getChipDefinition(commandType: string): {
		icon: string;
		label: string;
		backgroundColor: string;
		borderColor: string;
		textColor: string;
	};

	export interface ChipMapping {
		placeholder: string;
		originalJson: string;
		chipData: {
			type: string;
			command?: string;
			args?: any;
		};
		index: number;
	}

	export class ChipRenderer {
		convertToChips(text: string, options?: {placeholderFormat?: string}): {processedText: string; mappings: ChipMapping[]};
		restoreFromChips(text: string, mappings: ChipMapping[]): string;
	}

	export class CodeMirrorChipManager {
		constructor(editor: any, options?: {onChipClick?: (chipData: any, originalJson: string, position?: {from: {line: number; ch: number}; to: {line: number; ch: number}}) => void});
		convertToChips(text: string, existingMappings?: ChipMapping[]): {processedText: string; mappings: ChipMapping[]};
		renderChips(text: string, existingMappings?: ChipMapping[]): {processedText: string; mappings: ChipMapping[]};
		applyMarkers(processedText: string, mappings: ChipMapping[]): void;
		clearMarkers(): void;
		getChipAtPosition(pos: {line: number; ch: number}): ChipMapping | null;
		getChipMappingAtPosition(pos: {line: number; ch: number}): {mapping: ChipMapping; position: {from: {line: number; ch: number}; to: {line: number; ch: number}}} | null;
	}
}

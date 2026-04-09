import '@testing-library/jest-dom';
import {TextEncoder} from 'util';
import * as passageCommandFormsModule from '@twine-fork/dialog-forms';
import {
	WINDOW_LEGACY_INFICT_DIALOG_FORMS,
	WINDOW_LEGACY_TWINE_DIALOG_FORMS,
	WINDOW_PASSAGE_COMMAND_FORMS_MODULE
} from './config/snowcone-passage-command-editor';

// Mirror story-format hydrate: passage command editor loads Snowcone dialog-forms from window.
const snowconeModuleGlobals = window as unknown as Record<
	string,
	typeof passageCommandFormsModule
>;
snowconeModuleGlobals[WINDOW_PASSAGE_COMMAND_FORMS_MODULE] = passageCommandFormsModule;
snowconeModuleGlobals[WINDOW_LEGACY_TWINE_DIALOG_FORMS] = passageCommandFormsModule;
snowconeModuleGlobals[WINDOW_LEGACY_INFICT_DIALOG_FORMS] = passageCommandFormsModule;

global.TextEncoder = TextEncoder;

// jsdom doesn't implement this and we get an error from the library we use for
// markdown rendering.

window.scrollTo = jest.fn();

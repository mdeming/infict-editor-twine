/**
 * Event names, modal selector, and dialog lock for the extended passage editor ↔ Snowcone dialog-forms
 * / story-format hydrate.
 */

export const STORYFORMAT_DIALOG_MODAL_SELECTOR = '.storyformat-dialog-modal';

/** Dispatched when the user clicks JSON/request text in the proofing/story preview layer. */
export const STORYFORMAT_TEXT_CLICKED_EVENT = 'storyformat-text-clicked';

/** Dispatched when passage command forms mutate editor content (sync back to Twine state). */
export const STORYFORMAT_CONTENT_CHANGED_EVENT = 'storyformat-content-changed';

export function isStoryformatDialogOpen(): boolean {
	if (typeof document === 'undefined') {
		return false;
	}
	return document.querySelector(STORYFORMAT_DIALOG_MODAL_SELECTOR) !== null;
}

/** Set by Snowcone dialog-forms while a command modal is opening or open (prevents duplicates). */
export function isPassageCommandFormLockActive(): boolean {
	if (typeof window === 'undefined') {
		return false;
	}
	return Boolean(
		(window as unknown as {_dialogFormLock?: boolean})._dialogFormLock
	);
}

/** @deprecated Use `isPassageCommandFormLockActive`. */
export function isDialogFormLockActive(): boolean {
	return isPassageCommandFormLockActive();
}

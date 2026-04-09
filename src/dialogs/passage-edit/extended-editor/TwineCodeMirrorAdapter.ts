import type CodeMirror from 'codemirror';
import {getPassageCommandFormsModule} from './passage-command-forms-module';

const {CodeMirrorAdapter} = getPassageCommandFormsModule();

type ChangeListener = (text: string) => void;

export class TwineCodeMirrorAdapter extends CodeMirrorAdapter {
	private readonly onExternalChange?: ChangeListener;

	constructor(editor: CodeMirror.Editor, onExternalChange?: ChangeListener) {
		super(editor);
		this.onExternalChange = onExternalChange;
	}

	private notifyChange() {
		if (!this.onExternalChange) return;

		try {
			const text = this.getText();
			if (typeof text === 'string') {
				this.onExternalChange(text);
			}
		} catch (error) {
			console.warn('[Twine] Failed to sync change', error);
		}
	}

	insertText(text: string, position?: CodeMirror.Position) {
		const range = super.insertText(text, position);
		this.notifyChange();
		return range;
	}

	replaceText(text: string, from?: CodeMirror.Position, to?: CodeMirror.Position) {
		const range = super.replaceText(
			text,
			from as CodeMirror.Position,
			to as CodeMirror.Position
		);
		this.notifyChange();
		return range;
	}
}

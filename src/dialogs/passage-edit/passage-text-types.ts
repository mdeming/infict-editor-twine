import {Passage, Story} from '../../store/stories';
import {StoryFormat} from '../../store/story-formats';

export interface PassageTextProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onEditorChange: (value: CodeMirror.Editor) => void;
	passage: Passage;
	story: Story;
	storyFormat: StoryFormat;
	storyFormatExtensionsDisabled?: boolean;
	viewMode?: 'chip' | 'raw';
	onViewModeChange?: (mode: 'chip' | 'raw') => void;
}

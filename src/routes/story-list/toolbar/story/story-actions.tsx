import * as React from 'react';
import {ButtonBar} from '../../../../components/container/button-bar';
import {Story} from '../../../../store/stories';
import {CreateStoryButton} from './create-story-button';
import {DeleteStoryButton} from './delete-story-button';
import {DuplicateStoryButton} from './duplicate-story-button';
import {EditStoryButton} from './edit-story-button';
import {TagStoryButton} from './tag-story-button';

export interface StoryActionsProps {
	selectedStory?: Story;
}

export const StoryActions: React.FC<StoryActionsProps> = props => {
	const {selectedStory} = props;

	return (
		<ButtonBar>
			<CreateStoryButton />
			<EditStoryButton story={selectedStory} />
			<TagStoryButton story={selectedStory} />
			<DuplicateStoryButton story={selectedStory} />
			<DeleteStoryButton story={selectedStory} />
		</ButtonBar>
	);
};

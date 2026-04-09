import {IconFileText, IconX} from '@tabler/icons';
import * as React from 'react';
import {useTranslation} from 'react-i18next/';
import {ButtonBar} from '../components/container/button-bar';
import {CardContent} from '../components/container/card';
import {CardButton} from '../components/control/card-button';
import {IconButton} from '../components/control/icon-button';
import {IconFileTwee} from '../components/image/icon';
import {storyFileName} from '../electron/shared';
import {Story} from '../store/stories';
import {usePublishing} from '../store/use-publishing';
import {saveHtml, saveTwee} from '../util/save-file';
import {storyToTwee} from '../util/twee';
import {RemotePublishButton} from '../routes/story-edit/toolbar/remote-publish-button';

export interface BuildActionsProps {
	story?: Story;
}

export const BuildActions: React.FC<BuildActionsProps> = ({story}) => {
	const {publishStory} = usePublishing();
	const [publishError, setPublishError] = React.useState<Error>();
	const {t} = useTranslation();

	function resetErrors() {
		setPublishError(undefined);
	}

	async function handlePublishFile() {
		if (!story) {
			throw new Error('No story provided to publish');
		}

		resetErrors();

		try {
			saveHtml(await publishStory(story.id), storyFileName(story));
		} catch (error) {
			setPublishError(error as Error);
		}
	}

	function handleExportAsTwee() {
		if (!story) {
			throw new Error('No story provided to export');
		}

		saveTwee(storyToTwee(story), storyFileName(story, '.twee'));
	}

	return (
		<ButtonBar>
			<CardButton
				ariaLabel={publishError?.message ?? ''}
				disabled={!story}
				icon={<IconFileText />}
				label={t('routeActions.build.publishToFile')}
				onChangeOpen={() => setPublishError(undefined)}
				onClick={handlePublishFile}
				open={!!publishError}
			>
				<CardContent>
					<p>{publishError?.message}</p>
					<IconButton
						icon={<IconX />}
						label={t('common.close')}
						onClick={() => setPublishError(undefined)}
						variant="primary"
					/>
				</CardContent>
			</CardButton>
			<IconButton
				disabled={!story}
				icon={<IconFileTwee />}
				label={t('routeActions.build.exportAsTwee')}
				onClick={handleExportAsTwee}
			/>
			{story && (
				<RemotePublishButton
					storyId={story.id}
					variant="icon"
					label={t(
						'dialogs.storyFormatEditor.publishRemoteShort',
						'Publish to remote'
					)}
				/>
			)}
		</ButtonBar>
	);
};

import {fireEvent, render, screen} from '@testing-library/react';
import {axe} from 'jest-axe';
import * as React from 'react';
import {storyFileName} from '../../electron/shared';
import {Story} from '../../store/stories';
import {usePublishing} from '../../store/use-publishing';
import {fakeStory} from '../../test-util';
import {saveTwee} from '../../util/save-file';
import {storyToTwee} from '../../util/twee';
import {BuildActions, BuildActionsProps} from '../build-actions';

jest.mock('../../store/use-publishing');
jest.mock('../../util/save-file');

describe('<BuildActions>', () => {
	const saveTweeMock = saveTwee as jest.Mock;
	const usePublishingMock = usePublishing as jest.Mock;

	function renderComponent(props?: Partial<BuildActionsProps>) {
		return render(<BuildActions story={fakeStory()} {...props} />);
	}

	describe('when not given a story prop', () => {
		beforeEach(() => {
			usePublishingMock.mockReturnValue({});
			renderComponent({story: undefined});
		});

		it('disables the publish to story button', () =>
			expect(
				screen.getByText('routeActions.build.publishToFile')
			).toBeDisabled());

		it('disables the export to Twee button', () =>
			expect(
				screen.getByText('routeActions.build.exportAsTwee')
			).toBeDisabled());
	});

	describe('when given a story prop', () => {
		let publishStory: jest.SpyInstance;
		let story: Story;

		beforeEach(() => {
			publishStory = jest.fn();
			usePublishingMock.mockReturnValue({publishStory});
			story = fakeStory();
			renderComponent({story});
		});

		it('displays a button to publish the story to a file', () => {
			expect(publishStory).not.toHaveBeenCalled();
			fireEvent.click(screen.getByText('routeActions.build.publishToFile'));
			expect(publishStory.mock.calls).toEqual([[story.id]]);
		});

		it('displays the error if publishing fails', async () => {
			publishStory.mockRejectedValue(new Error('mock-publish-error'));
			fireEvent.click(screen.getByText('routeActions.build.publishToFile'));
			expect(await screen.findByText('mock-publish-error')).toBeInTheDocument();
		});

		it('displays a button to export the story as Twee', () => {
			expect(saveTweeMock).not.toHaveBeenCalled();
			fireEvent.click(screen.getByText('routeActions.build.exportAsTwee'));
			expect(saveTweeMock.mock.calls).toEqual([
				[storyToTwee(story), storyFileName(story, '.twee')]
			]);
		});
	});

	it('is accessible', async () => {
		usePublishingMock.mockReturnValue({});

		const {container} = renderComponent();

		expect(await axe(container)).toHaveNoViolations();
	});
});

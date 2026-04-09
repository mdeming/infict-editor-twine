import {act, render, screen} from '@testing-library/react';
import {axe} from 'jest-axe';
import * as React from 'react';
import {useStoriesContext} from '../../../../../store/stories';
import {
	FakeStateProvider,
	FakeStateProviderProps,
	StoryInspector
} from '../../../../../test-util';
import {StoryActions} from '../story-actions';

const TestStoryActions: React.FC = () => {
	const {stories} = useStoriesContext();

	return <StoryActions story={stories[0]} />;
};

describe('<StoryActions>', () => {
	async function renderComponent(contexts?: FakeStateProviderProps) {
		const result = render(
			<FakeStateProvider {...contexts}>
				<TestStoryActions />
				<StoryInspector />
			</FakeStateProvider>
		);

		await act(() => Promise.resolve());
		return result;
	}

	it('displays a find/replace button', async () => {
		await renderComponent();
		expect(
			screen.getByText('routes.storyEdit.toolbar.findAndReplace')
		).toBeInTheDocument();
	});

	it('displays a story details button', async () => {
		await renderComponent();
		expect(screen.getByText('common.details')).toBeInTheDocument();
	});

	it('displays a passage tags button', async () => {
		await renderComponent();
		expect(
			screen.getByText('routes.storyEdit.toolbar.passageTags')
		).toBeInTheDocument();
	});

	it('displays a story JavaScript button', async () => {
		await renderComponent();
		expect(
			screen.getByText('routes.storyEdit.toolbar.javaScript')
		).toBeInTheDocument();
	});

	it('displays a story stylesheet button', async () => {
		await renderComponent();
		expect(
			screen.getByText('routes.storyEdit.toolbar.stylesheet')
		).toBeInTheDocument();
	});

	it('is accessible', async () => {
		const {container} = await renderComponent();

		expect(await axe(container)).toHaveNoViolations();
	});
});

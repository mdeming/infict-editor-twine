import {getDefaultStoryFormat} from '../../config/format-defaults';
import {i18n} from '../../util/i18n';
import {Passage, Story} from './stories.types';

export const DEFAULT_STORY_FORMAT = getDefaultStoryFormat();

export const passageDefaults = (): Omit<Passage, 'id' | 'story'> => ({
	height: 100,
	highlighted: false,
	left: 0,
	name: i18n.t('store.passageDefaults.name'),
	selected: false,
	tags: [],
	text: '',
	top: 0,
	width: 100
});

export const storyDefaults = (): Omit<Story, 'id'> => ({
	ifid: '',
	lastUpdate: new Date(),
	passages: [],
	name: i18n.t('store.storyDefaults.name'),
	script: '',
	selected: false,
	snapToGrid: true,
	startPassage: '',
	storyFormat: DEFAULT_STORY_FORMAT.name,
	storyFormatVersion: DEFAULT_STORY_FORMAT.version,
	stylesheet: '',
	tags: [],
	tagColors: {},
	zoom: 1
});

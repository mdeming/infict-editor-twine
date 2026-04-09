import Fuse from 'fuse.js';
import uniq from 'lodash/uniq';
import {Passage, StorySearchFlags, Story} from './stories.types';
import {createRegExp} from '../../util/regexp';
import {parseLinks, LinkInfo} from '../../util/parse-links';
import {normalizeTag} from '../../util/tag';

// Custom interface for passage connections that includes link description
export interface PassageConnection {
	from: Passage;
	to: Passage;
	description?: string;
}

export function passageWithId(
	stories: Story[],
	storyId: string,
	passageId: string
) {
	const story = storyWithId(stories, storyId);

	if (!story) {
		throw new Error(`There is no story with ID "${storyId}".`);
	}

	const passage = story.passages.find(p => p.id === passageId);

	if (!passage) {
		throw new Error(
			`There is no passage with ID "${passageId}" in a story with ID "${storyId}".`
		);
	}

	return passage;
}

export function passageWithName(
	stories: Story[],
	storyId: string,
	passageName: string
) {
	const story = storyWithId(stories, storyId);

	if (!story) {
		throw new Error(`There is no story with ID "${storyId}".`);
	}

	const passage = story.passages.find(p => p.name === passageName);

	if (passage) {
		return passage;
	}

	throw new Error(
		`There is no passage with name "${passageName}" in a story with ID "${storyId}".`
	);
}

/**
 * Returns connections between passages in a structure optimized for rendering.
 * Connections are divided between draggable and fixed, depending on whether
 * either of their passages are selected (and could be dragged by the user).
 * Now also includes link descriptions for styling.
 */
export function passageConnections(
	passages: Passage[],
	connectionParser?: (text: string) => string[] | LinkInfo[]
) {
	// Default parser now includes descriptions
	const parser = connectionParser ?? 
		((text: string) => parseLinks(text, true, true) as LinkInfo[]);
		
	const passageMap = new Map(passages.map(p => [p.name, p]));
	const result = {
		draggable: {
			broken: new Set<Passage>(),
			connections: new Map<Passage, Set<PassageConnection>>(),
			self: new Set<Passage>()
		},
		fixed: {
			broken: new Set<Passage>(),
			connections: new Map<Passage, Set<PassageConnection>>(),
			self: new Set<Passage>()
		}
	};

	passages.forEach(passage => {
		const links = parser(passage.text);
		
		// Process each link
		for (const link of links) {
			// Handle both string and LinkInfo formats for backward compatibility
			const targetName = typeof link === 'string' ? link : link.target;
			const description = typeof link === 'string' ? undefined : link.description;
			
			if (targetName === passage.name) {
				(passage.selected ? result.draggable : result.fixed).self.add(passage);
			} else {
				const targetPassage = passageMap.get(targetName);

				if (targetPassage) {
					const target =
						passage.selected || targetPassage.selected
							? result.draggable
							: result.fixed;

					const connection: PassageConnection = {
						from: passage,
						to: targetPassage,
						description
					};

					if (target.connections.has(passage)) {
						target.connections.get(passage)!.add(connection);
					} else {
						target.connections.set(passage, new Set([connection]));
					}
				} else {
					(passage.selected ? result.draggable : result.fixed).broken.add(
						passage
					);
				}
			}
		}
	});

	return result;
}

/**
 * Returns a set of passages matching a fuzzy search crtieria.
 */
export function passagesMatchingFuzzySearch(
	passages: Passage[],
	search: string,
	count = 5
) {
	if (search.trim() === '') {
		return [];
	}

	const fuse = new Fuse(passages, {
		ignoreLocation: true,
		keys: [
			{name: 'name', weight: 0.6},
			{name: 'text', weight: 0.4}
		]
	});

	return fuse.search(search, {limit: count}).map(({item}) => item);
}

/**
 * Returns all passages matching a search criteria. Use
 * `highlightPassageMatches()` to highlight exactly what matched.
 */
export function passagesMatchingSearch(
	passages: Passage[],
	search: string,
	flags: StorySearchFlags
): Passage[] {
	if (search === '') {
		return [];
	}

	const {includePassageNames, matchCase, useRegexes} = flags;
	let matcher: RegExp;

	try {
		matcher = createRegExp(search, {matchCase, useRegexes});
	} catch (error) {
		// The regexp was malformed. Take no action.
		return [];
	}

	return passages.reduce((result, passage) => {
		if (
			matcher.test(passage.text) ||
			(includePassageNames && matcher.test(passage.name))
		) {
			return [...result, passage];
		}

		return result;
	}, [] as Passage[]);
}

export function storyPassageTags(story: Story) {
	return Array.from(
		story.passages.reduce((result, passage) => {
			passage.tags &&
				passage.tags.forEach(tag => {
					const normalized = normalizeTag(tag);
					if (normalized) result.add(normalized);
				});
			return result;
		}, new Set<string>())
	).sort();
}

export function storyStats(story: Story) {
	// Call parseLinks with explicit false for includeDescription to ensure string[] return type
	const allLinks: string[] = [];
	
	story.passages.forEach(passage => {
		// Explicitly get string[] result by setting includeDescription to false
		const passageLinks = parseLinks(passage.text, false, false) as string[];
		passageLinks.forEach(link => {
			if (allLinks.indexOf(link) === -1) {
				allLinks.push(link);
			}
		});
	});

	const brokenLinks = uniq(allLinks).filter(
		link => !story.passages.some(passage => passage.name === link)
	);

	return {
		brokenLinks,
		links: allLinks,
		characters: story.passages.reduce(
			(count, passage) => count + passage.text.length,
			0
		),
		passages: story.passages.length,
		words: story.passages.reduce(
			(count, passage) => count + passage.text.split(/\s+/).length,
			0
		)
	};
}

export function storyTags(stories: Story[]) {
	return Array.from(
		stories.reduce((result, story) => {
			story.tags && story.tags.forEach(tag => result.add(tag));
			return result;
		}, new Set<string>())
	).sort();
}

export function storyWithId(stories: Story[], storyId: string) {
	const result = stories.find(s => s.id === storyId);

	if (result) {
		return result;
	}

	throw new Error(`There is no story with ID "${storyId}".`);
}

export function storyWithName(stories: Story[], name: string) {
	const result = stories.find(s => s.name === name);

	if (result) {
		return result;
	}

	throw new Error(`There is no story with name "${name}".`);
}

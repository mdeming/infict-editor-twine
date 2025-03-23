/*
Parses passage text for links. Optionally, it returns internal links only --
e.g. those pointing to other passages in a story, not to an external web site.
*/

import uniq from 'lodash/uniq';

// The top level regular expression to catch links -- i.e. [[link]].
const extractLinkTags = (text: string) => text.match(/\[\[.*?\]\]/g) || [];

// Links _not_ starting with a protocol, e.g. abcd://.
const internalLinks = (link: string | LinkInfo): boolean => {
	const linkTarget = typeof link === 'string' ? link : link.target;
	return !/^\w+:\/\/\/?\w/i.test(linkTarget);
};

// Links with some text in them.
const nonEmptyLinks = (link: string | LinkInfo): boolean => {
	const linkTarget = typeof link === 'string' ? link : link.target;
	return linkTarget !== '';
};

// Setter is the second [] block if exists.
const removeSetters = (link: string) => {
	const noSetter = getField(link, '][', 0);

	return noSetter ?? link;
};

const removeEnclosingBrackets = (link: string) =>
	link.substr(2, link.length - 4);

/**
 * Split the link by the separator and return the field in the given index.
 * Negative indices start from the end of the array.
 */
const getField = (link: string, separator: string, index: number) => {
	const fields = link.split(separator);

	if (fields.length === 1) {
		/* Separator not present. */
		return undefined;
	}

	return index < 0 ? fields[fields.length + index] : fields[index];
};

export interface LinkInfo {
	target: string;
	description?: string;
}

// Arrow links:
// [[display text->link]] format
// [[link<-display text]] format
// Interpret the rightmost '->' and the leftmost '<-' as the divider.

const extractLinkInfo = (tagContent: string): LinkInfo => {
	// Check for display text -> link format
	const rightArrowTarget = getField(tagContent, '->', -1);
	if (rightArrowTarget) {
		const parts = tagContent.split('->');
		return {
			target: parts[parts.length - 1],
			description: parts.slice(0, -1).join('->')
		};
	}

	// Check for link <- display text format
	const leftArrowTarget = getField(tagContent, '<-', 0);
	if (leftArrowTarget) {
		const parts = tagContent.split('<-');
		return {
			target: parts[0],
			description: parts.slice(1).join('<-')
		};
	}

	// Check for TiddlyWiki links: [[display text|link]] format
	const pipeTarget = getField(tagContent, '|', -1);
	if (pipeTarget) {
		const parts = tagContent.split('|');
		return {
			target: parts[parts.length - 1],
			description: parts.slice(0, -1).join('|')
		};
	}

	// Simple [[link]] format - no description
	return {
		target: tagContent
	};
};

/**
 * Returns a list of unique links in passage source code.
 * Now has an option to return link info objects that include both target and description.
 */
export function parseLinks(text: string, internalOnly?: boolean, includeDescription = false) {
	// Link matching regexps ignore setter components, should they exist.
	const linkInfos = extractLinkTags(text)
		.map(removeEnclosingBrackets)
		.map(removeSetters)
		.map(extractLinkInfo)
		.filter(nonEmptyLinks);

	let result;

	if (includeDescription) {
		// Return full link info objects with targets and descriptions
		result = linkInfos;
	} else {
		// For backward compatibility, just return the target strings
		result = uniq(linkInfos.map(info => info.target));
	}

	if (internalOnly) {
		if (includeDescription) {
			// Handle LinkInfo[] case
			result = (result as LinkInfo[]).filter(info => internalLinks(info));
		} else {
			// Handle string[] case
			result = (result as string[]).filter(link => internalLinks(link));
		}
	}

	return result;
}

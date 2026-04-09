import * as React from 'react';
import {getPassageCommandFormsModule} from './passage-command-forms-module';
import './view-mode-toggle.css';

export interface ViewModeToggleProps {
	editorId?: string;
	currentMode: 'chip' | 'raw';
	onModeChange?: (mode: 'chip' | 'raw') => void;
	className?: string;
}

/**
 * Chip vs raw JSON view toggle when the story format advertises `supportsChipView` in editor extensions.
 */
export const ViewModeToggle: React.FC<ViewModeToggleProps> = props => {
	const {editorId, currentMode, onModeChange, className = ''} = props;
	const isRawView = currentMode === 'raw';

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newMode: 'chip' | 'raw' = e.target.checked ? 'raw' : 'chip';
		if (editorId) {
			getPassageCommandFormsModule().saveViewMode(editorId, newMode);
		}
		if (onModeChange) {
			onModeChange(newMode);
		}
	};

	return (
		<label
			className={`view-mode-toggle-label ${
				isRawView ? 'view-mode-toggle-checked' : ''
			} ${className}`}
		>
			<input
				type="checkbox"
				className="view-mode-toggle-checkbox"
				checked={isRawView}
				onChange={handleChange}
				title={isRawView ? 'Switch to chip view' : 'Switch to raw JSON view'}
			/>
			<span className="view-mode-toggle-text">Raw View</span>
		</label>
	);
};

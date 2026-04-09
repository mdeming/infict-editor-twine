import * as React from 'react';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {BackButton} from './back-button';
import './route-toolbar.css';

export interface RouteToolbarProps {
	pinnedControls?: React.ReactNode;
	tabs: Record<string, React.ReactNode>;
}

export const RouteToolbar: React.FC<RouteToolbarProps> = props => {
	const {pinnedControls, tabs} = props;

	return (
		<div className="route-toolbar">
			<Tabs selectedTabClassName="selected">
				<div className="route-toolbar-top">
					<BackButton />
					<TabList className="route-toolbar-tablist">
						{Object.keys(tabs).map(tabName => (
							<Tab className="route-toolbar-tab" key={tabName}>
								{tabName}
							</Tab>
						))}
					</TabList>
					<div className="route-toolbar-pinned-controls">
						{pinnedControls}
					</div>
				</div>
				<div>
					{Object.entries(tabs).map(([tabName, tabContent]) => (
						<TabPanel key={tabName}>{tabContent}</TabPanel>
					))}
				</div>
			</Tabs>
		</div>
	);
};

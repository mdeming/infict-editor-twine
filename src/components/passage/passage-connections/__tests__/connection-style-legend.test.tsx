import {render, screen} from '@testing-library/react';
import * as React from 'react';
import {ConnectionStyleLegend} from '../connection-style-legend';

describe('<ConnectionStyleLegend>', () => {
	it('renders nothing when legend is null', () => {
		const {container} = render(
			<ConnectionStyleLegend legend={null} visibleZoom={1} />
		);
		expect(container.firstChild).toBeNull();
	});

	it('renders title and rows when items are present', () => {
		render(
			<ConnectionStyleLegend
				legend={{
					title: 'Test legend',
					items: [
						{
							label: 'SMS',
							colorClass: 'connection-style-1',
							markerId: 'link-marker-1'
						}
					]
				}}
				visibleZoom={1}
			/>
		);
		expect(screen.getByText('Test legend')).toBeInTheDocument();
		expect(screen.getByText('SMS')).toBeInTheDocument();
	});

	it('uses viewport-fixed class when fixedViewport is set', () => {
		const {unmount} = render(
			<ConnectionStyleLegend
				fixedViewport
				legend={{
					title: 'L',
					items: [{label: 'A', colorClass: 'connection-style-1'}]
				}}
			/>
		);
		expect(
			document.body.querySelector('.connection-style-legend--viewport-fixed')
		).toBeTruthy();
		unmount();
	});
});

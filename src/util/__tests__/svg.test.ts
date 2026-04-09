import {faker} from '@faker-js/faker';
import {
	arc,
	arcPointAtT,
	arcPointOffsetAlongOutwardNormal,
	ArcProps
} from '../svg';

function expectPointClose(
	a: {left: number; top: number},
	b: {left: number; top: number}
) {
	expect(a.left).toBeCloseTo(b.left, 5);
	expect(a.top).toBeCloseTo(b.top, 5);
}

describe('arc', () => {
	it('returns an SVG arc descriptor', () => {
		const end = {left: faker.number.int(), top: faker.number.int()};
		const largeArc = faker.datatype.boolean();
		const radius = {left: faker.number.int(), top: faker.number.int()};
		const rotation = faker.number.int();
		const start = {left: faker.number.int(), top: faker.number.int()};
		const sweep = faker.datatype.boolean();

		expect(arc({end, largeArc, radius, rotation, start, sweep})).toBe(
			'M' +
				start.left +
				',' +
				start.top +
				' A' +
				radius.left +
				',' +
				radius.top +
				' ' +
				(rotation ?? '0') +
				(largeArc ? ' 1' : ' 0') +
				(sweep ? ' 1 ' : ' 0 ') +
				end.left +
				',' +
				end.top
		);
	});
});

describe('arcPointAtT', () => {
	const horizontalArc: ArcProps = {
		start: {left: 0, top: 0},
		end: {left: 100, top: 0},
		radius: {left: 100, top: 75},
		rotation: 0,
		sweep: true
	};

	it('returns start and end at t=0 and t=1', () => {
		expectPointClose(arcPointAtT(horizontalArc, 0), horizontalArc.start);
		expectPointClose(arcPointAtT(horizontalArc, 1), horizontalArc.end);
	});

	it('midpoint on arc differs from chord midpoint for a curved connector', () => {
		const midArc = arcPointAtT(horizontalArc, 0.5);
		const chord = {
			left: (horizontalArc.start.left + horizontalArc.end.left) / 2,
			top: (horizontalArc.start.top + horizontalArc.end.top) / 2
		};
		const distFromChord = Math.hypot(midArc.left - chord.left, midArc.top - chord.top);
		expect(distFromChord).toBeGreaterThan(1);
	});

	it('matches start/end for the opposing sweep (right-to-left link)', () => {
		const opposite: ArcProps = {
			start: {left: 100, top: 0},
			end: {left: 0, top: 0},
			radius: {left: 100, top: 75},
			rotation: 180,
			sweep: false
		};
		expectPointClose(arcPointAtT(opposite, 0), opposite.start);
		expectPointClose(arcPointAtT(opposite, 1), opposite.end);
		const midArc = arcPointAtT(opposite, 0.5);
		const chordMid = {
			left: (opposite.start.left + opposite.end.left) / 2,
			top: (opposite.start.top + opposite.end.top) / 2
		};
		expect(Math.hypot(midArc.left - chordMid.left, midArc.top - chordMid.top)).toBeGreaterThan(
			1
		);
	});

	it('ignores radiusScale at t=0 and t=1 so endpoints stay on the drawn path', () => {
		expectPointClose(
			arcPointAtT(horizontalArc, 0, {radiusScale: 2}),
			horizontalArc.start
		);
		expectPointClose(
			arcPointAtT(horizontalArc, 1, {radiusScale: 2}),
			horizontalArc.end
		);
	});

	it('radiusScale moves interior points outward from the ellipse center', () => {
		const mid = arcPointAtT(horizontalArc, 0.5);
		const boosted = arcPointAtT(horizontalArc, 0.5, {radiusScale: 1.25});
		expect(Math.hypot(boosted.left - mid.left, boosted.top - mid.top)).toBeGreaterThan(5);
	});
});

describe('arcPointOffsetAlongOutwardNormal', () => {
	const horizontalArc: ArcProps = {
		start: {left: 0, top: 0},
		end: {left: 100, top: 0},
		radius: {left: 100, top: 75},
		rotation: 0,
		sweep: true
	};

	it('places the point about the requested distance from the stroke along the normal', () => {
		const onStroke = arcPointAtT(horizontalArc, 0.5);
		const d = 12;
		const offset = arcPointOffsetAlongOutwardNormal(horizontalArc, 0.5, d);
		const dist = Math.hypot(offset.left - onStroke.left, offset.top - onStroke.top);
		expect(dist).toBeCloseTo(d, 1);
	});

	it('keeps similar offset for a longer chord (same perpendicular distance)', () => {
		const longArc: ArcProps = {
			start: {left: 0, top: 0},
			end: {left: 500, top: 0},
			radius: {left: 500, top: 375},
			rotation: 0,
			sweep: true
		};
		const d = 10;
		const onShort = arcPointOffsetAlongOutwardNormal(horizontalArc, 0.5, d);
		const onLong = arcPointOffsetAlongOutwardNormal(longArc, 0.5, d);
		const strokeShort = arcPointAtT(horizontalArc, 0.5);
		const strokeLong = arcPointAtT(longArc, 0.5);
		const distShort = Math.hypot(
			onShort.left - strokeShort.left,
			onShort.top - strokeShort.top
		);
		const distLong = Math.hypot(
			onLong.left - strokeLong.left,
			onLong.top - strokeLong.top
		);
		expect(distShort).toBeCloseTo(d, 1);
		expect(distLong).toBeCloseTo(d, 1);
	});
});

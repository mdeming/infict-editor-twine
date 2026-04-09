import {Point} from './geometry';

export interface ArcProps {
	end: Point;
	largeArc?: boolean;
	radius: Point;
	rotation?: number;
	start: Point;
	sweep?: boolean;
}

/**
 * Returns an SVG path string between two points.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#arcs
 */
export function arc({start, end, radius, largeArc, sweep, rotation}: ArcProps) {
	return (
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
}

export type ArcPointAtTOptions = {
	/**
	 * Scales both ellipse radii (>1 pushes the point away from the arc center).
	 * Only applied for 0 < t < 1 so endpoints stay on the drawn path.
	 */
	radiusScale?: number;
};

/**
 * Returns a point on the elliptical arc at parameter t (0 = start, 1 = end).
 * Used to place markers at the arc midpoint (t = 0.5).
 * @see https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
 */
export function arcPointAtT(
	{start, end, radius, largeArc, sweep, rotation}: ArcProps,
	t: number,
	options?: ArcPointAtTOptions
): Point {
	const φ = ((rotation ?? 0) * Math.PI) / 180;
	const cosφ = Math.cos(φ);
	const sinφ = Math.sin(φ);
	const x1 = start.left;
	const y1 = start.top;
	const x2 = end.left;
	const y2 = end.top;
	const rx = Math.abs(radius.left);
	const ry = Math.abs(radius.top);

	const x1p = cosφ * (x1 - x2) / 2 + sinφ * (y1 - y2) / 2;
	const y1p = -sinφ * (x1 - x2) / 2 + cosφ * (y1 - y2) / 2;

	const q = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
	const k = q <= 0 ? 0 : Math.sqrt(Math.max(0, rx * rx * ry * ry - q) / q);
	// SVG F.6.5: if large-arc ≠ sweep, choose '+' for the radical term; else '-'.
	// Coerce omitted largeArc to false (matches arc() when largeArc is undefined).
	const fa = largeArc === true;
	const fs = sweep === true;
	const sign = fa !== fs ? 1 : -1;
	const cxp = sign * k * rx * y1p / ry;
	const cyp = -sign * k * ry * x1p / rx;

	const cx = cosφ * cxp - sinφ * cyp + (x1 + x2) / 2;
	const cy = sinφ * cxp + cosφ * cyp + (y1 + y2) / 2;

	const θ1 = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
	const θ2 = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx);
	let dθ = θ2 - θ1;
	if (sweep && dθ < 0) dθ += 2 * Math.PI;
	if (!sweep && dθ > 0) dθ -= 2 * Math.PI;
	const θ = θ1 + t * dθ;

	const scale =
		options?.radiusScale != null && t > 0 && t < 1
			? options.radiusScale
			: 1;

	return {
		left: cx + scale * rx * Math.cos(θ) * cosφ - scale * ry * Math.sin(θ) * sinφ,
		top: cy + scale * rx * Math.cos(θ) * sinφ + scale * ry * Math.sin(θ) * cosφ
	};
}

/**
 * Point on the stroke at t, offset by a fixed distance along the curve normal on
 * the bulge side (perpendicular to the tangent, toward the arc’s outer side).
 * Distance uses the same units as the SVG coordinate system, so it stays even
 * when arc length changes.
 */
export function arcPointOffsetAlongOutwardNormal(
	props: ArcProps,
	t: number,
	outwardDistance: number
): Point {
	const onStroke = arcPointAtT(props, t);
	const chordMid = {
		left: (props.start.left + props.end.left) / 2,
		top: (props.start.top + props.end.top) / 2
	};
	const bulgeLeft = onStroke.left - chordMid.left;
	const bulgeTop = onStroke.top - chordMid.top;

	const pickNormal = (nx: number, ny: number) => {
		if (nx * bulgeLeft + ny * bulgeTop < 0) {
			return {left: -nx, top: -ny};
		}
		return {left: nx, top: ny};
	};

	const deltaT = 0.02;
	const t0 = Math.max(0, t - deltaT);
	const t1 = Math.min(1, t + deltaT);
	let p0 = arcPointAtT(props, t0);
	let p1 = arcPointAtT(props, t1);
	let dx = p1.left - p0.left;
	let dy = p1.top - p0.top;
	let len = Math.hypot(dx, dy);

	if (len < 1e-6 && t0 !== t1) {
		p0 = arcPointAtT(props, Math.max(0, t - 0.1));
		p1 = arcPointAtT(props, Math.min(1, t + 0.1));
		dx = p1.left - p0.left;
		dy = p1.top - p0.top;
		len = Math.hypot(dx, dy);
	}

	let n: {left: number; top: number};
	if (len < 1e-6) {
		const chordDx = props.end.left - props.start.left;
		const chordDy = props.end.top - props.start.top;
		const chordLen = Math.hypot(chordDx, chordDy);
		if (chordLen < 1e-10) {
			return onStroke;
		}
		const tx = chordDx / chordLen;
		const ty = chordDy / chordLen;
		n = pickNormal(-ty, tx);
	} else {
		const tx = dx / len;
		const ty = dy / len;
		n = pickNormal(-ty, tx);
	}

	const nLen = Math.hypot(n.left, n.top);
	if (nLen < 1e-10) {
		return onStroke;
	}
	const scale = outwardDistance / nLen;
	return {
		left: onStroke.left + n.left * scale,
		top: onStroke.top + n.top * scale
	};
}

/**
 * Returns an SVG path string that goes start → midpoint → end (two arc segments)
 * so that marker-mid is drawn at the midpoint. Uses the same largeArc and sweep
 * as the full arc so the two halves align and match arc() exactly.
 */
export function arcWithMidpoint(props: ArcProps): string {
	const mid = arcPointAtT(props, 0.5);
	const {radius, rotation, largeArc, sweep} = props;
	const r = radius.left + ',' + radius.top;
	const rot = rotation ?? 0;
	const la = largeArc ? ' 1' : ' 0';
	const sw = sweep ? ' 1 ' : ' 0 ';
	return (
		'M' + props.start.left + ',' + props.start.top +
		' A' + r + ' ' + rot + la + sw + mid.left + ',' + mid.top +
		' A' + r + ' ' + rot + la + sw + props.end.left + ',' + props.end.top
	);
}

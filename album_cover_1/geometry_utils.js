export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get_distance(p) {
        // returns distance from p to this in pixels
        var xd = Math.abs(p.x - this.x);
        var yd = Math.abs(p.y - this.y);
        return Math.pow(Math.pow(xd, 2) + Math.pow(yd, 2), 0.5);
    }
}


function onSegment(p, q, r) {
    if (q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) && q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y)) {
        return true;
    }
    return false;
}


function orientation(p, q, r) {
    // Returns orientation of ordered triplet (p, q, r).
    // The function returns following values
    // 0 = colinear
    // 1 = clockwise
    // 2 = counterclockwise
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val == 0) return 0;
    else if (val > 0) return 1;
    else return 2;
}


export function lines_do_intersect(p1, q1, p2, q2) {
    // determine whether a line between p1 & q1 intersects with a line between p2 & q2
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    if (o1 != o2 && o3 != o4) return true;

    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and q2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false;
}
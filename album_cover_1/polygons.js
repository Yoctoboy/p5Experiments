import { Point, lines_do_intersect } from "./geometry_utils.js"


export function draw_polygons() {
    blendMode(EXCLUSION);

    const random_seed = Math.floor(random(0, 900000));
    console.log("Random seed for polygons = " + random_seed);
    randomSeed(random_seed);

    let points_amount = 30;
    let max_height = 300;
    let min_dist = 50;
    let max_dist = 90;
    let points = create_points(min_dist, max_dist, points_amount, max_height);

    let stroke_weight = 5;
    let c = color(0, 200, 255, 60);
    stroke(c);
    strokeWeight(stroke_weight);
    draw_lines(points);

    let p1 = new Point(0, 1);
    let q1 = new Point(1, 2);
    let p2 = new Point(0, 0);
    let q2 = new Point(4, 5);
    console.log(lines_do_intersect(p1, q1, p2, q2));
}


function create_points(min_dist, max_dist, amount, max_height) {
    let points = [new Point(0, 0), new Point(width / 15, 0), new Point(2 * width / 15, 0)];
    for (let i = points.length; i < amount; i++) {
        let point_ok = false;
        while (!point_ok) {
            point_ok = false;
            var x = random(width);
            var y = random(max_height);
            var new_point = new Point(x, y);
            for (let j = 0; j < i; j++) {
                let dist = new_point.get_distance(points[j]);
                if (dist < min_dist) {
                    point_ok = false;
                    break;
                }
                if (dist < max_dist) point_ok = true;
            }
        }
        points.push(new_point);
    }
    return points;
}



function intersect(all_lines, a, b) {
    // determine whether a line linking a & b will intersect one of the lines in all_lines
    all_lines.forEach(l => {
        let intersection = lines_do_intersect(l.p1, l.p2, a, b);
        if (intersection) return true;
    })
    return false;
}


function draw_lines(points) {
    let all_lines = [];
    all_lines.push({ "p1": points[0], "p2": points[1] });
    for (let i = 2; i < points.length; i++) {
        function compare_dist(a, b) {
            let dista = points[i].get_distance(a);
            let distb = points[i].get_distance(b);
            if (dista < distb) return -1;
            else return 1;
        }

        let subarray = points.slice(0, i);
        subarray.sort(compare_dist);

        let added_lines = 0;
        for (let j = 0; j < subarray.length; j++) {
            if (!intersect(all_lines, points[i], subarray[j])) {
                all_lines.push({ "p1": points[i], "p2": subarray[j] });
                added_lines++;
            }
            if (added_lines >= 2) break;
        }
    }

    // draw all lines
    all_lines.forEach(coords => line(coords.p1.x, coords.p1.y, coords.p2.x, coords.p2.y));
}
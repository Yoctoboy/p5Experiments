let branches = [];
let branches_amount = 1000;
const max_steps = 10000;


export function draw_bottom_branches() {
    // ensure the generated pattern is different on each page refresh
    // GOOD SEEDS: (65460 334034); (591106 491244); (840189 251902); (307286 533252)
    const perlin_seed = Math.floor(random(0, 900000));
    // const perlin_seed = 787043;
    noise_module.seed(perlin_seed);
    const random_seed = Math.floor(random(0, 900000));
    // const random_seed = 754521;
    randomSeed(random_seed)
    console.log(perlin_seed, random_seed)

    let x = - width / 20;
    let y = height;
    let min_speedy = -1.5;
    let max_speedy = -1;
    let min_speedx = 3;
    let max_speedx = 5;
    branches = create_branches(branches_amount, x, y, min_speedx, max_speedx, min_speedy, max_speedy);
    draw_branches(branches);
}


function draw_branches(branches) {
    for (let step = 0; step < max_steps; step++) {
        branches.forEach(branch => {
            branch.move(step);
            branch.draw();
            branch.update_visible();
        })
    }
}


// higher factor makes the branches faster and makes them stay more grouped
// recommended range: [0.1, 10]
const noise_speed_factor = 0.25;

class Branch {
    constructor(x, y, min_speedx, max_speedx, min_speedy, max_speedy) {
        this.x = x
        this.y = y
        this.prevx = x;
        this.prevy = y;
        this.speedx = random(min_speedx, max_speedx);
        this.speedy = random(min_speedy, max_speedy);
        this.color = color(map(this.speedy, min_speedy, max_speedy, 120, 220), 0, 100, 40);
        this.visible = true;
    }

    move(step) {
        // updates current position of the branch
        this.speedx += noise_speed_factor * noise_module.simplex3(this.x * 0.002, this.y * 0.002, step * 0.00001);
        this.speedy += noise_speed_factor * noise_module.simplex3(this.y * 0.002, this.x * 0.002, step * 0.00001);
        this.x += this.speedx;
        this.y += this.speedy;
    }

    draw() {
        // draws a straight, semi-transparent line between former and current position of the branch
        if (this.visible) {
            stroke(this.color);
            line(this.prevx, this.prevy, this.x, this.y);
        }
    }

    update_visible() {
        // if the current position of the branch is outside the canvas' boundaries, do not draw it anymore
        this.prevx = this.x;
        this.prevy = this.y;
        if (this.x < -width || this.y < 0 || this.x > width || this.y > height) this.visible = false;
    }
}

function create_branches(amount, x, y, min_speedx, max_speedx, min_speedy, max_speedy) {
    let branches = [];
    for (let i = 0; i < amount; i++) {
        branches.push(new Branch(x, y, min_speedx, max_speedx, min_speedy, max_speedy));
    }
    return branches;
}

function draw() {
    all_branches.forEach(branch => {
        branch.move();
        branch.draw();
        branch.update_visible();
        step += 1;
    })
}

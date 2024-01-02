export function randomExponential(lambda) {
    var randomUniform = Math.random();
    return -Math.log(randomUniform) / lambda;
}

export function randomExponentialAvg(avg) {
    var randomUniform = Math.random();
    return -Math.log(randomUniform) * avg;
}

export function randomInterval(min, max) {
    return Math.random() * (max - min) + min;
}

export function randInt(min, max) {
    // random integer between min and max (included)
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

export function randomAround(value, ratio = 0.5) {
    return randomInterval(value * ratio, value / ratio);
}

export function get_orthogonal_vector(vector, normalize = true) {
    orthogonal_vector = createVector(1, -vector.x / vector.y);
    if (normalize) orthogonal_vector.normalize();
    return orthogonal_vector;
}

export function percentage(partialValue, totalValue, round = 2) {
    return (
        Math.round(((100 * partialValue) / totalValue) * Math.pow(10, round)) / Math.pow(10, round)
    );
}

export function invertPercentage(partialValue, totalValue, round = 2) {
    return (
        100 -
        Math.round(((100 * partialValue) / totalValue) * Math.pow(10, round)) / Math.pow(10, round)
    );
}

export function clip(value, min, max) {
    return Math.min(Math.max(min, value), max);
}

export function poweredClip(value, min, max, power = 2) {
    return Math.max(
        Math.min(
            Math.pow(Math.min(Math.max(min, value), max), power) / Math.pow(max, power - 1),
            max
        ),
        min
    );
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export function normalDistribution(min, max, skew) {
    let u = 0,
        v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0)
        num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    else {
        num = Math.pow(num, skew); // Skew
        num *= max - min; // Stretch to fill range
        num += min; // offset to min
    }
    return num;
}

export function gaussianFunction(mu, sigma, x) {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

function randomExponential(lambda) {
    var randomUniform = Math.random();
    return -Math.log(randomUniform) / lambda;
}

function randomExponentialAvg(avg) {
    var randomUniform = Math.random();
    return -Math.log(randomUniform) * avg;
}

function randomInterval(min, max) {
    return Math.random() * (max - min) + min;
}

function randInt(min, max) {
    // random integer between min and max (included)
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function randomAround(value, ratio = 0.5) {
    return randomInterval(value * ratio, value / ratio);
}

function get_orthogonal_vector(vector, normalize = true) {
    orthogonal_vector = createVector(1, -vector.x / vector.y);
    if (normalize) orthogonal_vector.normalize();
    return orthogonal_vector;
}

function percentage(partialValue, totalValue, round = 2) {
    return Math.round(((100 * partialValue) / totalValue) * Math.pow(10, round)) / Math.pow(10, round);
}

function invertPercentage(partialValue, totalValue, round = 2) {
    return 100 - (Math.round(((100 * partialValue) / totalValue) * Math.pow(10, round)) / Math.pow(10, round));
}

function clip(value, min, max) {
    return Math.min(Math.max(min, value), max)
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
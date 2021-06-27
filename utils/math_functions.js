function randomExponential(lambda){
    var randomUniform = Math.random();
    return -Math.log(randomUniform)/lambda;
}

function randomInterval(min, max) {
    return Math.random() * (max - min) + min;
}

function get_orthogonal_vector(vector, normalize=true){
    orthogonal_vector = createVector(1, -vector.x / vector.y);
    if (normalize) orthogonal_vector.normalize();
    return orthogonal_vector;
}
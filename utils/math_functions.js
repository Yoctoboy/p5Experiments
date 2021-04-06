function randomExponential(lambda){
    var randomUniform = Math.random()
    return -Math.log(randomUniform)/lambda;
}
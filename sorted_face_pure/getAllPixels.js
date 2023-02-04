export function getAllPixels(canvasHeight, canvasWidth, renderer) {
    // const flatPixels = get(0, 0, canvasHeight, canvasWidth).pixels;
    renderer.loadPixels();
    const flatPixels = renderer.pixels;
    let imgPixels = new Array(canvasHeight);
    for (var i = 0; i < canvasHeight; i++) {
        imgPixels[i] = new Array();
        for (var j = 0; j < canvasWidth; j++) {
            imgPixels[i].push(flatPixels.subarray((i * 4 * canvasHeight) + 4 * j, i * 4 * canvasHeight + 4 * j + 4))
        }
    }
    return imgPixels;
}
export function getAllPixels(canvas_height, canvas_width, renderer) {
    // const flatPixels = get(0, 0, canvas_height, canvas_width).pixels;
    renderer.loadPixels();
    const flatPixels = renderer.pixels;
    let imgPixels = new Array(canvas_height);
    for (var i = 0; i < canvas_height; i++) {
        imgPixels[i] = new Array();
        for (var j = 0; j < canvas_width; j++) {
            imgPixels[i].push(flatPixels.subarray((i * 4 * canvas_height) + 4 * j, i * 4 * canvas_height + 4 * j + 4))
        }
    }
    return imgPixels;
}
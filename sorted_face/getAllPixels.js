export function getAllPixels(canvas_height, canvas_width) {
    loadPixels();
    const flatPixels = get(0, 0, canvas_height, canvas_width);
    console.log(flatPixels)
    let pixels = new Array(canvas_height);
    for (var i = 0; i < canvas_height; i++) {
        pixels[i] = new Array();
        for (var j = 0; j < canvas_width; j++) {
            pixels[i].push(flatPixels.subarray((i * 4 * canvas_height) + 4 * j, i * 4 * canvas_height + 4 * j + 4))
        }
    }
    return pixels;
}
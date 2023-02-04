export class PixelMatrix {
    constructor(mat) {
        this.mat = mat;
        this.height = this.mat.length;
        this.width = this.mat[0].length;
    }

    get(h, w) {
        if (0 <= h && h < this.height) {
            if (0 <= w && w < this.width) {
                return this.mat[h][w];
            }
        }
        return 0;
    }

}
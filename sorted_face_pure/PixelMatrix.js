export class PixelMatrix {
    constructor(mat) {
        this.mat = mat;
        this.height = this.mat.length;
        this.width = this.mat[0].length;
    }

    get(h, w) {
        let hint = Math.round(h), wint = Math.round(w);
        if (0 <= hint && hint < this.height) {
            if (0 <= wint && wint < this.width) {
                return this.mat[hint][wint];
            }
        }
        return 0;
    }

}
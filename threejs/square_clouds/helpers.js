export const distance = (a, b) => {
    return Math.sqrt(
        Math.pow(Math.abs(a.centerx - b.centerx), 2) + Math.pow(Math.abs(a.centerz, b.centerz), 2)
    );
};

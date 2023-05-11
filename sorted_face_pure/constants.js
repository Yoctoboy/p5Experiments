import { Element2D } from "./Element2D.js";

// Photo by <a href="https://unsplash.com/@zulmaury?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Zulmaury Saavedra</a> on <a href="https://unsplash.com/photos/kXC0dbqtRe4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
export const image_name = 'face_1_1500.jpg'
export const canvasWidth = 1780;
export const canvasHeight = 1780;

// export const image_name = 'face_2_687_1031.jpg'
// export const canvasWidth = 687;
// export const canvasHeight = 1031;

// export const image_name = 'raised_hands_neg_727_988.jpg'
// export const canvasWidth = 727;
// export const canvasHeight = 988;

// export const image_name = 'raised_hands_neg_727_727.jpg'
// export const canvasWidth = 727;
// export const canvasHeight = 727;

// export const image_name = 'red_shadowy_mountain_1170_780.jpg'
// export const canvasWidth = 1170;
// export const canvasHeight = 780;

// export const image_name = 'wood_lake_neg_1230_1230.jpg'
// export const canvasWidth = 1230;
// export const canvasHeight = 1230;

// export const image_name = 'wood_lake_1230_1230.jpg'
// export const canvasWidth = 1230;
// export const canvasHeight = 1230;

// export const image_name = 'nun_781_781.jpg'
// export const canvasWidth = 781;
// export const canvasHeight = 781;

export let directionVector = new Element2D(1, 1);
export let oppositeDirectionVector = directionVector.opposite()
export let backwardOverlapLengthAverage = 8;
export let forwardOverlapLengthAverage = 4;
export let maximumShadeMarginToBreakLine = 10; // randomness in condition to decide the end of a line
export let minimumPixelShade = 10;
export let minimumLineShade = 10;
export let maximumLineShade = 200;
export let minimumLineLengthAverage = 10;
export let averageStrokeWeight = 0.8;
export let linesToSkipRatioAverage = 0.2;
export let clippingPower = 1.3; // the higher, the more contrasted, default=1
export let lineBrightnessRandomAdjustmentMargin = 15;
export let lineAlpha = 255;

// see https://stackoverflow.com/a/32558929 to understand how it works
export function defineConstants(pass) {
    if (pass === 1) {
        directionVector = new Element2D(1, 0.2);
        oppositeDirectionVector = directionVector.opposite();
        backwardOverlapLengthAverage = 20;
        forwardOverlapLengthAverage = 50;
        maximumShadeMarginToBreakLine = 10; // randomness in condition to decide the end of a line
        minimumPixelShade = 24;
        minimumLineShade = 24;
        maximumLineShade = 255;
        minimumLineLengthAverage = 10;
        averageStrokeWeight = 2;
        linesToSkipRatioAverage = 0.2;
        clippingPower = 1; // the higher, the more contrasted, default=1
        lineBrightnessRandomAdjustmentMargin = 15;
        lineAlpha = 45
        blendMode(REPLACE)
    }
    if (pass === 2) {
        directionVector = new Element2D(1, 0.2);
        oppositeDirectionVector = directionVector.opposite();
        backwardOverlapLengthAverage = 20;
        forwardOverlapLengthAverage = 84;
        maximumShadeMarginToBreakLine = 10; // randomness in condition to decide the end of a line
        minimumLineLengthAverage = 10;
        // averageStrokeWeight = 1;
        minimumPixelShade = 24;
        minimumLineShade = 30;
        maximumLineShade = 255;
        linesToSkipRatioAverage = 0.25;
        clippingPower = 0.7; // the higher, the more contrasted, default=1
        lineBrightnessRandomAdjustmentMargin = 15;
        lineAlpha = 23
        blendMode(ADD)
    }
    // if (pass === false) {
    //     directionVector = new Element2D(1, 0.3);
    //     oppositeDirectionVector = directionVector.opposite();
    //     backwardOverlapLengthAverage = 20;
    //     forwardOverlapLengthAverage = 54;
    //     maximumShadeMarginToBreakLine = 10; // randomness in condition to decide the end of a line
    //     minimumPixelShade = 0;
    //     minimumLineShade = 0;
    //     minimumLineLengthAverage = 10;
    //     // averageStrokeWeight = 1;
    //     linesToSkipRatioAverage = 0.15;
    //     clippingPower = 0.7; // the higher, the more contrasted, default=1
    //     lineBrightnessRandomAdjustmentMargin = 15;
    //     lineAlpha = 20
    //     blendMode(ADD)
    // }

    // if (pass === false) {
    //     directionVector = new Element2D(1, -0.05);
    //     oppositeDirectionVector = directionVector.opposite();
    //     backwardOverlapLengthAverage = 30;
    //     forwardOverlapLengthAverage = 30;
    //     maximumShadeMarginToBreakLine = 10; // randomness in condition to decide the end of a line
    //     minimumPixelShade = 10;
    //     minimumLineShade = 10;
    //     minimumLineLengthAverage = 10;
    //     // averageStrokeWeight = 1;
    //     linesToSkipRatioAverage = 0;
    //     clippingPower = 0.7; // the higher, the more contrasted, default=1
    //     lineBrightnessRandomAdjustmentMargin = 15;
    //     lineAlpha = 20
    //     blendMode(ADD)
    // }
    // if (pass === false) {
    //     directionVector = new Element2D(1, -0.05);
    //     oppositeDirectionVector = directionVector.opposite();
    //     backwardOverlapLengthAverage = 20;
    //     forwardOverlapLengthAverage = 60;
    //     maximumShadeMarginToBreakLine = 10; // randomness in condition to decide the end of a line
    //     minimumPixelShade = 1;
    //     minimumLineShade = 1;
    //     minimumLineLengthAverage = 10;
    //     // averageStrokeWeight = 1;
    //     linesToSkipRatioAverage = 0;
    //     clippingPower = 1; // the higher, the more contrasted, default=1
    //     lineBrightnessRandomAdjustmentMargin = 15;
    //     lineAlpha = 18
    //     blendMode(ADD)
    // }

}

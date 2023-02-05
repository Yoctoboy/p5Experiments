import { Element2D } from "./Element2D.js";

// export const image_name = 'face_1_687.jpg'
// export const canvasWidth = 687;
// export const canvasHeight = 687;

export const image_name = 'face_2_687_1031.jpg'
export const canvasWidth = 687;
export const canvasHeight = 1031;

export const directionVector = new Element2D(1, 1);
export const oppositeDirectionVector = directionVector.opposite();

export const backwardOverlapLengthAverage = 8;
export const forwardOverlapLengthAverage = 4;
export const maximumShadeMarginToBreakLine = 10;
export const minimumPixelShade = 20;
export const minimumLineShadeAverage = 20;
export const minimumLineLengthAverage = 20;
export const averageStokeWeight = 2;

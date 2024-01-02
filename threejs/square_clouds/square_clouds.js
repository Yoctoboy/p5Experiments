import * as THREE from "three";
import Island from "./Island";
import { randInt } from "./math_functions";
import { MAXX, MAXY, MAXZ, minDistanceBetweenIslands } from "./constants";
import { distance } from "./helpers";

const square_clouds = (scene) => {
    console.log("cube");

    let isOk = false;
    let islandsCoords;
    do {
        const islandsAmount = randInt(3, 10);
        islandsCoords = [...Array(islandsAmount)].map(() => {
            return { centerx: randInt(0, MAXX), centerz: randInt(0, MAXZ), posy: randInt(0, MAXY) };
        });
        console.log(islandsCoords);
        isOk = true;
        for (var i = 0; i < islandsCoords.length && isOk; i++) {
            for (var j = i + 1; j < islandsCoords.length && isOk; j++) {
                if (distance(islandsCoords[i], islandsCoords[j]) < minDistanceBetweenIslands) {
                    isOk = false;
                }
            }
        }
    } while (!isOk);

    const islands = islandsCoords.map((coords) => new Island({ scene, ...coords, size: 10 }));
    islands.forEach((island) => island.generate());
};

export default square_clouds;

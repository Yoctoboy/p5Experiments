import * as THREE from "three";

import CameraControls from "camera-controls";
import { draw_cartesian_axes } from "../helpers/draw_cartesian_axes";
import square_clouds from "./square_clouds";

CameraControls.install({ THREE: THREE });

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(100, 0, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cameraControls = new CameraControls(camera, renderer.domElement);

draw_cartesian_axes(scene, 10);

square_clouds(scene);

function animate() {
    const delta = clock.getDelta();
    cameraControls.update(delta);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

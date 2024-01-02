import * as THREE from "three";

export const draw_cartesian_axes = (scene, factor = 1) => {
  // x line
  const xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const xPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(factor, 0, 0)];
  const xGeometry = new THREE.BufferGeometry().setFromPoints(xPoints);
  const xLine = new THREE.Line(xGeometry, xMaterial);
  scene.add(xLine);

  // y line
  const yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const yPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, factor, 0)];
  const yGeometry = new THREE.BufferGeometry().setFromPoints(yPoints);
  const yLine = new THREE.Line(yGeometry, yMaterial);
  scene.add(yLine);

  // z line
  const zMaterial = new THREE.LineBasicMaterial({ color: 0x5555ff });
  const zPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, factor)];
  const zGeometry = new THREE.BufferGeometry().setFromPoints(zPoints);
  const zLine = new THREE.Line(zGeometry, zMaterial);
  scene.add(zLine);
};

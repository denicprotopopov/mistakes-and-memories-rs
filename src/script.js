import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { SceneManager } from './sceneManager';
import { createBlueScene } from './scenes/blueScene';
import { createRedScene } from './scenes/redScene';

const stats = new Stats();
document.body.appendChild(stats.dom);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Canvas
const canvas = document.querySelector('canvas.webgl');
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Scene Manager
const sceneManager = new SceneManager(renderer, camera);

// Add scenes with animation and pixelation options
const blueScene = createBlueScene();
sceneManager.addScene('blue', blueScene.scene, blueScene.animate, true, 10);  // Pixelation enabled with pixel size 10

const redScene = createRedScene();
sceneManager.addScene('red', redScene.scene, redScene.animate, true, 2);  // Pixelation disabled

// Set initial active scene
// sceneManager.setActiveScene('blue');

// Handle scene switching
export const switchToBlueScene = () => {
    sceneManager.setActiveScene('blue');
    console.log('Switched to blue scene (pixelation enabled)');
};

export const switchToRedScene = () => {
    sceneManager.setActiveScene('red');
    console.log('Switched to red scene (pixelation disabled)');
};

// Animation loop
const animate = () => {
    sceneManager.render();
    stats.update();
    requestAnimationFrame(animate);
};
animate();

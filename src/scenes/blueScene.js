import * as THREE from 'three';

export function createBlueScene() {
    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 'blue' });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation function for this scene
    const animate = () => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
    };

    return { scene, animate };
}
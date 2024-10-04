import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { getMixers } from './loader'

const stats = new Stats()
document.body.appendChild(stats.dom)


const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

const cursor = { x: 0, y: 0 };

// Initialize mouse/touch movement tracking
window.addEventListener('mousemove', (event) => {
    cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
    cursor.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        cursor.x = (touch.clientX / window.innerWidth) * 2 - 1;
        cursor.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    }
});

// Canvas
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Model Scenes
export const sceneCity = new THREE.Scene()
export const sceneArmory = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'blue'})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const materialRed = new THREE.MeshBasicMaterial({color: 'red'})
const meshRed = new THREE.Mesh(geometry, materialRed)
const sceneRed = new THREE.Scene()
sceneRed.add(meshRed)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(sizes.width, sizes.height)


const renderPass1 = new RenderPass(scene, camera)
const renderPass2 = new RenderPass(sceneRed, camera)
const renderPassArmory = new RenderPass(sceneArmory, camera)
const renderPassCity = new RenderPass(sceneCity, camera)

export const getSceneOne = () => {
	disposeAll()
	effectComposer.addPass(renderPass1)
	console.log(effectComposer);	
	console.log('blue cube');
}

export const getSceneTwo = () => {
	disposeAll()
	effectComposer.addPass(renderPass2)
	console.log(effectComposer);	
	console.log('red cube');
	
}

export const getSceneArmory = () => {
	disposeAll()
	effectComposer.addPass(renderPassArmory)
	console.log(effectComposer);	
	console.log('armory');
	
}

export const getSceneCity = () => {
	disposeAll()
	effectComposer.addPass(renderPassCity)
	console.log(effectComposer);	
	console.log('city');
	
}

const disposeAll = () => {
	for (var i = effectComposer.passes.length - 1; i >= 0; i--) {
		effectComposer.passes[i].dispose()
		effectComposer.removePass(effectComposer.passes[i])
		scene.remove(camera)
	}
}

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const clock = new THREE.Clock()

const animate = () => {

	const delta = clock.getDelta();

    // Update camera positions based on cursor
    const maxOffsetX = 1;
    const maxOffsetY = 1;

    camera.position.x += (((cursor.x * maxOffsetX) - camera.position.x) * 0.1);
    camera.position.y += (((cursor.y * maxOffsetY) - camera.position.y) * 0.1);
    camera.position.z = 5 - sizes.width / sizes.height;

    camera.lookAt(0, 0, 0);
	getMixers().forEach(mixer => mixer.update(delta));

    // renderer.render(scene, camera)
	effectComposer.render()

    requestAnimationFrame(animate)
	stats.update()
}

animate()
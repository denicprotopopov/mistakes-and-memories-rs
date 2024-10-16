import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { getMixers } from './loader'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

let terrainPlane;
let terrainPlane2;
let noise = new SimplexNoise();

// const stats = new Stats()
// document.body.appendChild(stats.dom)


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
export const sceneDrone = new THREE.Scene()
export const sceneDog = new THREE.Scene()

export const sceneCity = new THREE.Scene()
sceneCity.background = new THREE.Color('#bdbebf')
const fog = new THREE.Fog('#bdbebf', 1, 100)
sceneCity.fog = fog

export const sceneBrownstone = new THREE.Scene()
sceneBrownstone.background = new THREE.Color('#bdbebf')
const fog5 = new THREE.Fog('#bdbebf', 2, 50)
sceneBrownstone.fog = fog5

export const sceneArmory = new THREE.Scene()
const fog2 = new THREE.Fog('#bdbebf', 2, 5)
sceneArmory.fog = fog2

export const sceneControlRoom = new THREE.Scene()
const fog4 = new THREE.Fog('#bdbebf', 2, 15)
sceneControlRoom.fog = fog4

export const sceneMetro = new THREE.Scene()
sceneMetro.background = new THREE.Color('#bdbebf')
const fog3 = new THREE.Fog('#bdbebf', 2, 15)
sceneMetro.fog = fog3




export const sceneTerrain = new THREE.Scene();
sceneTerrain.background = new THREE.Color('#87CEEB');
sceneTerrain.fog = new THREE.Fog('#87CEEB', 5, 30);

const planeGeometry = new THREE.PlaneGeometry(50, 50, 100, 100);
const matcapTexture = new THREE.TextureLoader().load('/matcap2.png');
const planeMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
    side: THREE.DoubleSide,
});

terrainPlane = new THREE.Mesh(planeGeometry, planeMaterial);
terrainPlane.rotation.x = -Math.PI / 2;
terrainPlane.position.y = -2
sceneTerrain.add(terrainPlane);

const terrainLight = new THREE.DirectionalLight(0xffffff, 0.2);
terrainLight.position.set(10, 15, 10);
sceneTerrain.add(terrainLight);

const terrainAmbientLight = new THREE.AmbientLight(0xffffff, 0.4);
sceneTerrain.add(terrainAmbientLight);

const defaultOptions = {
    speed: 0.1,
    frequency: 0.5, // Lower frequency for smoother terrain
    amplitude: 0.3, // Lower amplitude for reduced spikes
};

let time = 0;
export const updateTerrain = (options = defaultOptions) => {
    time += options.speed * 0.01;
    const position = terrainPlane.geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const elevation = noise.noise3d(x * options.frequency, y * options.frequency, time) * options.amplitude;
        position.setZ(i, elevation);
    }

    position.needsUpdate = true;
    terrainPlane.geometry.computeVertexNormals();
};



export const sceneTerrain2 = new THREE.Scene();
sceneTerrain2.background = new THREE.Color('#87CEEB');
sceneTerrain2.fog = new THREE.Fog('#87CEEB', 5, 30);

const planeGeometry2 = new THREE.PlaneGeometry(50, 50, 100, 100);
const matcapTexture2 = new THREE.TextureLoader().load('/matcap3.png');
const planeMaterial2 = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture2,
    side: THREE.DoubleSide,
});

terrainPlane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
terrainPlane2.rotation.x = -Math.PI / 2;
terrainPlane2.position.y = -2
sceneTerrain2.add(terrainPlane2);

const terrainLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
terrainLight2.position.set(10, 15, 10);
sceneTerrain2.add(terrainLight2);

const terrainAmbientLight2 = new THREE.AmbientLight(0xffffff, 0.4);
sceneTerrain2.add(terrainAmbientLight2);

const defaultOptions2 = {
    speed: 5,
    frequency: 0.9, // Lower frequency for smoother terrain
    amplitude: 0.5, // Lower amplitude for reduced spikes
};

let time2 = 0;
export const updateTerrain2 = (options = defaultOptions2) => {
    time += options.speed * 0.01;
    const position = terrainPlane2.geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const elevation = noise.noise3d(x * options.frequency, y * options.frequency, time) * options.amplitude;
        position.setZ(i, elevation);
    }

    position.needsUpdate = true;
    terrainPlane2.geometry.computeVertexNormals();
};





const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'blue'})
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

const materialRed = new THREE.MeshBasicMaterial({color: 'red'})
const meshRed = new THREE.Mesh(geometry, materialRed)
const sceneRed = new THREE.Scene()
sceneRed.add(meshRed)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)

scene.add(ambientLight)
sceneRed.add(ambientLight)
sceneCity.add(ambientLight)
sceneArmory.add(ambientLight)
sceneMetro.add(ambientLight)
sceneControlRoom.add(ambientLight)
sceneDog.add(ambientLight)
sceneDrone.add(ambientLight)
sceneBrownstone.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9)
const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.9)
directionalLight.position.z = 3
directionalLight3.position.set(25, -5, 7)
directionalLight2.position.set(-25, -15, -10)
scene.add(directionalLight)
sceneRed.add(directionalLight)
sceneCity.add(directionalLight)
sceneArmory.add(directionalLight)
sceneCity.add(directionalLight3)
sceneDog.add(directionalLight)
sceneDrone.add(directionalLight)


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

const renderPixelatedPass = new RenderPixelatedPass(3, scene, camera);
renderPixelatedPass.normalEdgeStrength = 0
renderPixelatedPass.depthEdgeStrength = 0
const renderPixelatedPass2 = new RenderPixelatedPass(3, sceneRed, camera);
renderPixelatedPass2.normalEdgeStrength = 0
renderPixelatedPass2.depthEdgeStrength = 0
const renderPixelatedPass3 = new RenderPixelatedPass(3, sceneArmory, camera);
renderPixelatedPass3.normalEdgeStrength = 0
renderPixelatedPass3.depthEdgeStrength = 0
const renderPixelatedPass4 = new RenderPixelatedPass(3, sceneCity, camera);
renderPixelatedPass4.normalEdgeStrength = 0
renderPixelatedPass4.depthEdgeStrength = 0

const renderPixelatedPass5 = new RenderPixelatedPass(3, sceneMetro, camera);
renderPixelatedPass5.normalEdgeStrength = 0
renderPixelatedPass5.depthEdgeStrength = 0

const renderPixelatedPass6 = new RenderPixelatedPass(3, sceneTerrain, camera);
renderPixelatedPass6.normalEdgeStrength = 0
renderPixelatedPass6.depthEdgeStrength = 0

const renderPixelatedPass7 = new RenderPixelatedPass(3, sceneControlRoom, camera);
renderPixelatedPass7.normalEdgeStrength = 0
renderPixelatedPass7.depthEdgeStrength = 0

const renderPixelatedPass8 = new RenderPixelatedPass(3, sceneDog, camera);
renderPixelatedPass8.normalEdgeStrength = 0
renderPixelatedPass8.depthEdgeStrength = 0

const renderPixelatedPass9 = new RenderPixelatedPass(3, sceneDrone, camera);
renderPixelatedPass9.normalEdgeStrength = 0
renderPixelatedPass9.depthEdgeStrength = 0

const renderPixelatedPass10 = new RenderPixelatedPass(3, sceneBrownstone, camera);
renderPixelatedPass10.normalEdgeStrength = 0
renderPixelatedPass10.depthEdgeStrength = 0

const renderPixelatedPass11 = new RenderPixelatedPass(3, sceneTerrain2, camera);
renderPixelatedPass11.normalEdgeStrength = 0
renderPixelatedPass11.depthEdgeStrength = 0

export const getSceneOne = () => {
	disposeAll()
	// effectComposer.addPass(renderPass1)
	effectComposer.addPass(renderPixelatedPass)
	console.log(effectComposer);	
	console.log('blue cube');
}

export const getSceneTwo = () => {
	disposeAll()
	effectComposer.addPass(renderPixelatedPass2)
	console.log(effectComposer);	
	console.log('red cube');
	
}

export const getSceneArmory = () => {
	disposeAll()
	effectComposer.addPass(renderPixelatedPass3)
	// effectComposer.addPass(ditherPass);
	console.log(effectComposer);	
	console.log('armory');
	
}

export const getSceneCity = () => {
	disposeAll()
	effectComposer.addPass(renderPixelatedPass4)
	// effectComposer.addPass(ditherPass);
	console.log(effectComposer);	
	console.log('city');
	
}

export const getSceneMetro = () => {
	disposeAll()
	effectComposer.addPass(renderPixelatedPass5)
	// effectComposer.addPass(ditherPass);
	console.log(effectComposer);	
	console.log('metro');
	
}

export const getSceneTerrain = () => {
    disposeAll();
    effectComposer.addPass(renderPixelatedPass6);
    console.log('terrain scene');
};

export const getSceneTerrain2 = () => {
    disposeAll();
    effectComposer.addPass(renderPixelatedPass11);
    console.log('terrain scene');
};

export const getSceneControlRoom = () => {
    disposeAll();
    effectComposer.addPass(renderPixelatedPass7);
    console.log('terrain scene');
};

export const getSceneDog = () => {
    disposeAll();
    effectComposer.addPass(renderPixelatedPass8);
    console.log('terrain scene');
};

export const getSceneDrone = () => {
    disposeAll();
    effectComposer.addPass(renderPixelatedPass9);
    console.log('terrain scene');
};

export const getSceneBrownstone = () => {
    disposeAll();
    effectComposer.addPass(renderPixelatedPass10);
    console.log('terrain scene');
};

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

getSceneOne()

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
	updateTerrain();
	updateTerrain2();

    // renderer.render(scene, camera)
	effectComposer.render()

    requestAnimationFrame(animate)
	// stats.update()
}

animate()